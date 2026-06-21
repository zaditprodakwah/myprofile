import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Outscraper Webhook Endpoint
// Handles POST requests from Outscraper containing scraping results
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verification / Debugging
    console.log('Received Outscraper Webhook:', JSON.stringify(data, null, 2));

    // Basic validation
    if (data.status !== 'SUCCESS') {
      console.error('Outscraper task failed or not success:', data);
      return NextResponse.json({ success: false, message: 'Task not successful' }, { status: 400 });
    }

    const resultsLocation = data.results_location;
    if (!resultsLocation) {
      return NextResponse.json({ success: false, message: 'No results location provided' }, { status: 400 });
    }

    // Process the results in the background so we can respond to the webhook quickly
    processOutscraperResults(resultsLocation).catch(err => {
      console.error('Error processing Outscraper results:', err);
    });

    return NextResponse.json({ success: true, message: 'Webhook received and processing started' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// Function to fetch and process results from Outscraper
async function processOutscraperResults(resultsUrl: string) {
  try {
    const response = await fetch(resultsUrl);
    const results = await response.json();

    if (!Array.isArray(results)) {
      console.error('Unexpected Outscraper result format:', results);
      return;
    }

    // Google Maps Scraper usually returns an array of arrays if multiple queries were used
    const flatResults = results.flat();
    
    // Ingest into Supabase
    const payloads = flatResults.map((item: any) => {
      // Basic extraction based on Google Maps fields from Outscraper
      const name = item.name || 'Unknown Location';
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      let citySlug = 'jakarta-selatan'; // Default fallback
      if (item.city) {
        citySlug = String(item.city).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      return {
        city_slug: citySlug,
        entity_type: 'service', // Default to service
        name: name,
        slug: slug,
        tagline: item.type || item.category || 'Bisnis Lokal',
        description: item.about || item.description || `Bisnis berlokasi di ${item.full_address || citySlug}`,
        contact_phone: item.phone || null,
        contact_email: item.email_1 || item.email_2 || null, // Outscraper sometimes returns emails if requested
        website_url: item.site || null,
        logo_url: item.logo || item.photo || null,
        address: item.full_address || null,
        google_maps_url: item.place_link || null,
        verification_status: 'unverified',
        trust_score: item.reviews_data ? (Number(item.rating) || 4.0) : 4.0, // Default to 4.0 if no rating
        raw_metadata: {
          latitude: item.latitude,
          longitude: item.longitude,
          reviews_count: item.reviews,
          working_hours: item.working_hours,
          business_status: item.business_status
        }
      };
    });

    // Bulk insert with upsert (conflict on slug/city_slug is not native unless defined, 
    // but typically we can just insert or use onConflict constraint if we have one)
    // Assuming 'slug' is unique per city, but our schema might not have a composite unique key.
    // For safety, let's insert them directly or batch them.
    for (const batch of chunkArray(payloads, 50)) {
       const { error } = await supabase.from('directory_entities').upsert(batch, { onConflict: 'slug', ignoreDuplicates: true });
       if (error) {
         console.error('Error inserting Outscraper batch:', error);
       }
    }

    console.log(`Successfully processed ${payloads.length} Google Maps entities.`);
  } catch (error) {
    console.error('Error in processOutscraperResults:', error);
  }
}

function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
