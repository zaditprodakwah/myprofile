const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// 1. Manually parse .env.local to avoid dependency issues
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

// Initialize Supabase Client with Admin service role bypass
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.clear();
  console.log('=============================================');
  console.log('    ZADIT GROWTH PORTFOLIO - TERMINAL CLI    ');
  console.log('=============================================');
  console.log('1. Kelola Artikel Blog');
  console.log('2. Kelola Bank Referensi Data (Sovereign)');
  console.log('3. Kelola Entitas Direktori (pSEO)');
  console.log('4. Sinkronisasi Telemetry Cache (FRED, BPS, dll)');
  console.log('5. Ubah Pengaturan Sistem (WA, Status)');
  console.log('0. Keluar');
  console.log('---------------------------------------------');

  const choice = await question('Pilih menu (0-5): ');
  
  switch (choice.trim()) {
    case '1':
      await manageArticles();
      break;
    case '2':
      await manageReferences();
      break;
    case '3':
      await manageDirectory();
      break;
    case '4':
      await syncTelemetryCache();
      break;
    case '5':
      await manageSystemConfig();
      break;
    case '0':
      console.log('Sampai jumpa!');
      rl.close();
      process.exit(0);
    default:
      console.log('❌ Pilihan tidak valid.');
      await pause();
      await main();
  }
}

async function pause() {
  await question('\nTekan Enter untuk melanjutkan...');
}

// --- 1. Manage Articles ---
async function manageArticles() {
  console.clear();
  console.log('--- KELOLA ARTIKEL BLOG ---');
  console.log('1. Tampilkan Semua Artikel');
  console.log('2. Tambah Artikel Baru');
  console.log('3. Hapus Artikel');
  console.log('0. Kembali');
  
  const opt = await question('Pilih opsi: ');
  if (opt === '1') {
    const { data, error } = await supabase.from('articles').select('id, title, slug, is_published').order('published_at', { ascending: false });
    if (error) console.error('Gagal mengambil data:', error.message);
    else {
      console.log('\nDaftar Artikel:');
      data.forEach((art, i) => {
        console.log(`${i + 1}. [${art.is_published ? 'PUBLISHED' : 'DRAFT'}] ${art.title} (${art.slug})`);
      });
    }
  } else if (opt === '2') {
    const title = await question('Judul Artikel: ');
    const slug = await question('Slug URL (misal: cara-seo-umkm): ');
    const summary = await question('Ringkasan Meta Deskripsi: ');
    const content = await question('Konten Utama (HTML/Text): ');
    
    const payload = {
      title,
      slug: slug.toLowerCase().trim(),
      content: `<p>${content}</p>`,
      meta_title: `${title} | Zadit Growth Blog`,
      meta_description: summary,
      is_published: true,
      published_at: new Date().toISOString()
    };

    const { error } = await supabase.from('articles').insert([payload]);
    if (error) console.error('❌ Gagal menambahkan artikel:', error.message);
    else console.log('✅ Artikel baru berhasil ditambahkan!');
  } else if (opt === '3') {
    const slug = await question('Masukkan Slug Artikel yang ingin dihapus: ');
    const { error } = await supabase.from('articles').delete().eq('slug', slug);
    if (error) console.error('❌ Gagal menghapus:', error.message);
    else console.log('✅ Artikel berhasil dihapus!');
  }
  
  await pause();
  await main();
}

// --- 2. Manage References ---
async function manageReferences() {
  console.clear();
  console.log('--- KELOLA BANK REFERENSI DATA (SOVEREIGN) ---');
  console.log('1. Tampilkan Semua Referensi');
  console.log('2. Tambah Referensi Baru');
  console.log('3. Hapus Referensi');
  console.log('0. Kembali');

  const opt = await question('Pilih opsi: ');
  if (opt === '1') {
    const { data, error } = await supabase.from('reference_items').select('id, title, slug, category').order('created_at', { ascending: false });
    if (error) console.error('Gagal mengambil data:', error.message);
    else {
      console.log('\nDaftar Referensi:');
      data.forEach((ref, i) => {
        console.log(`${i + 1}. [${ref.category.toUpperCase()}] ${ref.title} (${ref.slug})`);
      });
    }
  } else if (opt === '2') {
    const title = await question('Judul Referensi: ');
    const slug = await question('Slug URL: ');
    console.log('Kategori: 1. growth-playbook | 2. seo-checklist | 3. market-benchmark | 4. civic-data');
    const catOpt = await question('Pilih Kategori (1-4): ');
    let category = 'growth-playbook';
    if (catOpt === '2') category = 'seo-checklist';
    else if (catOpt === '3') category = 'market-benchmark';
    else if (catOpt === '4') category = 'civic-data';

    const summary = await question('Ringkasan Singkat: ');
    const content = await question('Konten Utama (HTML/Text): ');
    const tagsStr = await question('Tags (pisahkan koma, misal: SEO, Growth): ');
    const source_name = await question('Nama Sumber (misal: BPS): ');
    const source_url = await question('URL Sumber: ');

    const payload = {
      title,
      slug: slug.toLowerCase().trim(),
      category,
      summary,
      content: `<h3>${title}</h3><p>${content}</p>`,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      source_name: source_name || null,
      source_url: source_url || null,
      is_active: true
    };

    const { error } = await supabase.from('reference_items').insert([payload]);
    if (error) console.error('❌ Gagal menambahkan referensi:', error.message);
    else console.log('✅ Referensi baru berhasil diterbitkan!');
  } else if (opt === '3') {
    const slug = await question('Masukkan Slug Referensi yang ingin dihapus: ');
    const { error } = await supabase.from('reference_items').delete().eq('slug', slug);
    if (error) console.error('❌ Gagal menghapus:', error.message);
    else console.log('✅ Referensi berhasil dihapus!');
  }

  await pause();
  await main();
}

// --- 3. Manage Directory ---
async function manageDirectory() {
  console.clear();
  console.log('--- KELOLA DIREKTORI ENTITAS (pSEO) ---');
  console.log('1. Tampilkan Entitas per Wilayah');
  console.log('2. Tambah Entitas Baru');
  console.log('0. Kembali');

  const opt = await question('Pilih opsi: ');
  if (opt === '1') {
    const city = await question('Masukkan Slug Kota (misal: cirebon, jakarta-selatan): ');
    const { data, error } = await supabase.from('entities').select('name, slug, verification_status').eq('city_slug', city);
    if (error) console.error('Gagal:', error.message);
    else {
      console.log(`\nDaftar Entitas di ${city}:`);
      data.forEach((ent, i) => {
        console.log(`${i + 1}. [${ent.verification_status.toUpperCase()}] ${ent.name} (${ent.slug})`);
      });
    }
  } else if (opt === '2') {
    const name = await question('Nama Entitas: ');
    const slug = await question('Slug URL: ');
    const city_slug = await question('Slug Kota (misal: cirebon): ');
    const address = await question('Alamat Lengkap: ');
    const google_maps_url = await question('Google Maps Link: ');
    console.log('Tipe: individual, institution, agency, brand, product, service');
    const entity_type = await question('Tipe Entitas: ');

    const payload = {
      name,
      slug: slug.toLowerCase().trim(),
      city_slug,
      address,
      google_maps_url,
      entity_type: entity_type || 'service',
      verification_status: 'verified',
      trust_score: 4.5
    };

    const { error } = await supabase.from('entities').insert([payload]);
    if (error) console.error('❌ Gagal menambahkan entitas:', error.message);
    else console.log('✅ Entitas baru berhasil ditambahkan ke direktori!');
  }

  await pause();
  await main();
}

// --- 4. Sync Telemetry Cache ---
async function syncTelemetryCache() {
  console.clear();
  console.log('--- SINKRONISASI TELEMETRY CACHE ---');
  console.log('Sedang menarik data indikator eksternal dan memperbarui database cache...');

  try {
    const vercelUrl = env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
    
    // Trigger FRED & BPS & Markets & News api route endpoints to refresh database caches
    console.log('- Memperbarui Suku Bunga FRED...');
    const fred = await fetch(`${vercelUrl}/api/sovereign/fred`).then(r => r.json()).catch(() => null);
    console.log(`  Result: ${fred?.success ? 'Sukses' : 'Gagal'}`);

    console.log('- Memperbarui Makroekonomi BPS...');
    const bps = await fetch(`${vercelUrl}/api/sovereign/macro-economics`).then(r => r.json()).catch(() => null);
    console.log(`  Result: ${bps?.success ? 'Sukses' : 'Gagal'}`);

    console.log('- Memperbarui Pasar & Kurs FX...');
    const markets = await fetch(`${vercelUrl}/api/sovereign/markets`).then(r => r.json()).catch(() => null);
    console.log(`  Result: ${markets?.success ? 'Sukses' : 'Gagal'}`);

    console.log('- Memperbarui Berita & AI Sentiment...');
    const news = await fetch(`${vercelUrl}/api/sovereign/news`).then(r => r.json()).catch(() => null);
    console.log(`  Result: ${news?.success ? 'Sukses' : 'Gagal'}`);

    console.log('\n✅ Sinkronisasi Telemetry Cache berhasil diselesaikan!');
  } catch (err) {
    console.error('❌ Sinkronisasi gagal:', err.message);
  }

  await pause();
  await main();
}

// --- 5. Manage System Config ---
async function manageSystemConfig() {
  console.clear();
  console.log('--- PENGATURAN SISTEM ---');
  
  // Get current configs
  const { data: status } = await supabase.from('system_configs').select('value').eq('key', 'available_status').maybeSingle();
  const { data: wa } = await supabase.from('system_configs').select('value').eq('key', 'whatsapp_number').maybeSingle();

  console.log(`1. Ketersediaan Proyek: ${status?.value || 'AVAILABLE'}`);
  console.log(`2. Nomor WhatsApp CTA: ${wa?.value || '6282316363177'}`);
  console.log('0. Kembali');

  const opt = await question('\nPilih opsi yang ingin diubah (1-2, 0=kembali): ');
  if (opt === '1') {
    const val = await question('Masukkan status baru (AVAILABLE / BUSY): ');
    const cleanVal = val.toUpperCase().trim();
    const { error } = await supabase.from('system_configs').upsert({ key: 'available_status', value: cleanVal });
    if (error) console.error('Gagal:', error.message);
    else console.log('✅ Status ketersediaan berhasil diperbarui!');
  } else if (opt === '2') {
    const val = await question('Masukkan nomor WhatsApp (misal: 6282316363177): ');
    const { error } = await supabase.from('system_configs').upsert({ key: 'whatsapp_number', value: val.trim() });
    if (error) console.error('Gagal:', error.message);
    else console.log('✅ Nomor WhatsApp berhasil diperbarui!');
  }

  await pause();
  await main();
}

// Run CLI
main();
