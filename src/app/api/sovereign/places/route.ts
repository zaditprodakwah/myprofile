import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// GET /api/sovereign/places
// Query params:
//   - placeId: Google Place ID to fetch details
//   - query: Text search query if Place ID is not known
//   - entityId: Optional database entity ID to automatically enrich and save
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const query = searchParams.get('query');
    const entityId = searchParams.get('entityId');

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'GOOGLE_CLOUD_API_KEY not configured' }, { status: 500 });
    }

    let targetPlaceId = placeId;

    // 1. If we only have a query, perform a Text Search to resolve the Place ID
    if (!targetPlaceId && query) {
      console.log(`Resolving Place ID for query: "${query}"...`);
      const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
      
      const searchRes = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName'
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: 'id'
        })
      });

      if (!searchRes.ok) {
        const errText = await searchRes.text();
        console.error('Google Places Text Search failed:', errText);
        return NextResponse.json({ success: false, error: 'Google Places search request failed', details: errText }, { status: 502 });
      }

      const searchData = await searchRes.json();
      const firstPlace = searchData.places?.[0];
      if (!firstPlace) {
        return NextResponse.json({ success: false, error: 'No places found matching the search query' }, { status: 404 });
      }
      targetPlaceId = firstPlace.id;
    }

    if (!targetPlaceId) {
      return NextResponse.json({ success: false, error: 'Missing placeId or query parameter' }, { status: 400 });
    }

    // 2. Fetch Places Details (v1)
    console.log(`Fetching Place details for Place ID: "${targetPlaceId}"...`);
    const detailsUrl = `https://places.googleapis.com/v1/places/${targetPlaceId}`;
    
    // We request only the required fields using X-Goog-FieldMask to minimize cost
    const fieldMask = [
      'id',
      'displayName',
      'formattedAddress',
      'rating',
      'userRatingCount',
      'nationalPhoneNumber',
      'websiteUri',
      'regularOpeningHours',
      'location'
    ].join(',');

    const detailsRes = await fetch(detailsUrl, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask
      }
    });

    if (!detailsRes.ok) {
      const errText = await detailsRes.text();
      console.error('Google Place Details request failed:', errText);
      return NextResponse.json({ success: false, error: 'Google Places details request failed', details: errText }, { status: 502 });
    }

    const placeDetails = await detailsRes.json();

    // 3. Format the Place details response
    const name = placeDetails.displayName?.text || '';
    const address = placeDetails.formattedAddress || '';
    const rating = placeDetails.rating || 0;
    const ratingCount = placeDetails.userRatingCount || 0;
    const phone = placeDetails.nationalPhoneNumber || '';
    const website = placeDetails.websiteUri || '';
    const location = placeDetails.location || {};
    const workingHours = placeDetails.regularOpeningHours || {};

    const enrichedData = {
      placeId: targetPlaceId,
      name,
      address,
      phone,
      website,
      rating,
      ratingCount,
      latitude: location.latitude || null,
      longitude: location.longitude || null,
      workingHours
    };

    // 4. If entityId is provided, write back to Supabase
    if (entityId) {
      console.log(`Saving enriched details for entity ID: "${entityId}"...`);

      // First fetch the existing entity to merge metadata
      const { data: existingEntity } = await supabaseServer
        .from('directory_entities')
        .select('raw_metadata')
        .eq('id', entityId)
        .maybeSingle();

      const mergedMetadata = {
        ...(existingEntity?.raw_metadata || {}),
        latitude: location.latitude || null,
        longitude: location.longitude || null,
        reviews_count: ratingCount,
        working_hours: workingHours,
        business_status: 'OPERATIONAL'
      };

      const updatePayload: any = {
        place_id: targetPlaceId,
        last_scraped: new Date().toISOString(),
        raw_metadata: mergedMetadata
      };

      // Only overwrite fields if Google has them
      if (address) updatePayload.address = address;
      if (phone) updatePayload.contact_phone = phone;
      if (website) updatePayload.website_url = website;
      if (rating) updatePayload.trust_score = rating;

      const { error: updateError } = await supabaseServer
        .from('directory_entities')
        .update(updatePayload)
        .eq('id', entityId);

      if (updateError) {
        console.error('Database update failed:', updateError);
        return NextResponse.json({ 
          success: true, 
          message: 'Enriched successfully, but failed to save to database', 
          data: enrichedData, 
          db_error: updateError.message 
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: entityId ? 'Enriched and updated successfully' : 'Enriched successfully',
      data: enrichedData
    });

  } catch (error: any) {
    console.error('Error in /api/sovereign/places:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
