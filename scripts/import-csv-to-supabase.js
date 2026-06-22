const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env.local to get Supabase credentials
const envPath = path.resolve(__dirname, '../.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[key] = value;
    }
  });
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

// Initialize Supabase Client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// Robust Zero-Dependency CSV Parser
function parseCSV(content) {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = parseCSVLine(lines[0]);
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record);
  }
  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Main Execution Function
async function main() {
  const csvPath = path.resolve(__dirname, 'output/results.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading CSV file: ${csvPath}...`);
  const content = fs.readFileSync(csvPath, 'utf8');
  const rawRecords = parseCSV(content);
  console.log(`✅ Loaded ${rawRecords.length} raw records from CSV.`);

  if (rawRecords.length === 0) {
    console.log('No records to import.');
    process.exit(0);
  }

  // Fetch existing cities
  console.log('🔍 Fetching existing cities from Supabase...');
  const { data: existingCities, error: citiesError } = await supabase
    .from('cities')
    .select('id, name, slug');

  if (citiesError) {
    console.error('❌ Error fetching cities:', citiesError.message);
    process.exit(1);
  }

  const cityCache = {}; // slug -> id
  existingCities.forEach(c => {
    cityCache[c.slug] = c.id;
  });
  console.log(`Loaded ${existingCities.length} cities from database.`);

  const directoryEntities = [];
  
  for (const record of rawRecords) {
    const title = record.title;
    if (!title) continue;

    // Determine city
    let cityName = 'Bandung'; // Fallback
    if (record.complete_address) {
      try {
        const addr = JSON.parse(record.complete_address);
        if (addr.city) {
          cityName = addr.city;
        }
      } catch (e) {}
    } else if (record.address) {
      if (record.address.toLowerCase().includes('bandung')) cityName = 'Bandung';
      else if (record.address.toLowerCase().includes('jakarta')) cityName = 'Jakarta Selatan';
      else if (record.address.toLowerCase().includes('cirebon')) cityName = 'Cirebon';
    }

    const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Check if city exists in cache, if not insert it
    if (!cityCache[citySlug]) {
      console.log(`➕ City "${cityName}" (${citySlug}) not found in DB. Creating it...`);
      const lat = parseFloat(record.latitude) || -6.9175;
      const lng = parseFloat(record.longitude) || 107.6191;
      
      const { data: newCity, error: createCityErr } = await supabase
        .from('cities')
        .insert({
          name: cityName,
          slug: citySlug,
          latitude: lat,
          longitude: lng,
          target_niche: 'UMKM & Bisnis Lokal'
        })
        .select('id')
        .single();

      if (createCityErr) {
        console.error(`❌ Failed to create city "${cityName}":`, createCityErr.message);
        continue;
      }
      
      cityCache[citySlug] = newCity.id;
      console.log(`✅ Created city "${cityName}" with ID: ${newCity.id}`);
    }

    const cityId = cityCache[citySlug];
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Parse emails safely
    let email = null;
    if (record.emails) {
      // If comma-separated, get the first one
      const emailsList = record.emails.split(',').map(e => e.trim()).filter(Boolean);
      if (emailsList.length > 0) {
        email = emailsList[0];
      }
    }

    // Determine entity type based on category
    let entityType = 'service';
    const categoryLower = (record.category || '').toLowerCase();
    if (categoryLower.includes('school') || categoryLower.includes('university') || categoryLower.includes('hospital') || categoryLower.includes('government') || categoryLower.includes('yayasan')) {
      entityType = 'institution';
    } else if (categoryLower.includes('agency') || categoryLower.includes('consultant')) {
      entityType = 'agency';
    } else if (categoryLower.includes('brand') || categoryLower.includes('manufacturer')) {
      entityType = 'brand';
    } else if (categoryLower.includes('product') || categoryLower.includes('shop') || categoryLower.includes('store')) {
      entityType = 'product';
    }

    const trustScore = record.review_rating ? parseFloat(record.review_rating) : 4.0;

    directoryEntities.push({
      city_id: cityId,
      city_slug: citySlug,
      entity_type: entityType,
      name: title,
      slug: slug,
      tagline: record.category || 'Bisnis Lokal',
      description: record.about || record.descriptions || `Profil bisnis ${title} di ${cityName}`,
      contact_phone: record.phone || null,
      contact_email: email,
      website_url: record.website || null,
      logo_url: record.thumbnail || null,
      address: record.address || null,
      google_maps_url: record.link || null,
      verification_status: 'unverified',
      trust_score: trustScore,
      raw_metadata: {
        latitude: record.latitude ? parseFloat(record.latitude) : null,
        longitude: record.longitude ? parseFloat(record.longitude) : null,
        review_count: record.review_count ? parseInt(record.review_count, 10) : 0,
        place_id: record.place_id || null,
        cid: record.cid || null,
        input_id: record.input_id || null,
        open_hours: record.open_hours || null
      }
    });
  }

  console.log(`📤 Preparing to upsert ${directoryEntities.length} directory entities...`);

  // Batch insert/upsert in chunks of 50 to avoid request body size limits
  const chunkSize = 50;
  let successfulUpserts = 0;

  for (let i = 0; i < directoryEntities.length; i += chunkSize) {
    const batch = directoryEntities.slice(i, i + chunkSize);
    const { error: upsertError } = await supabase
      .from('directory_entities')
      .upsert(batch, { onConflict: 'slug', ignoreDuplicates: false });

    if (upsertError) {
      console.error(`❌ Error upserting batch starting at index ${i}:`, upsertError.message);
    } else {
      successfulUpserts += batch.length;
      console.log(`📈 Successfully upserted ${successfulUpserts}/${directoryEntities.length} entities...`);
    }
  }

  console.log(`\n🎉 Import completed. Total successfully imported/updated: ${successfulUpserts} entities.`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});
