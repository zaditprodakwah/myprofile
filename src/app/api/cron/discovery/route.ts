import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { JSDOM } from 'jsdom';

const MAX_DEPTH = 3;

function verifySecret(req: Request) {
  const envSecret = process.env.CRON_SECRET;
  if (!envSecret) return true; 

  const authHeader = req.headers.get('authorization');
  if (authHeader === `Bearer ${envSecret}`) return true;

  const url = new URL(req.url);
  if (url.searchParams.get('secret') === envSecret) return true;

  return false;
}

export async function GET(req: Request) {
  if (!verifySecret(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Ambil 5 antrean teratas
    const { data: queue, error: fetchError } = await supabase
      .from('crawl_queue')
      .select('*')
      .eq('status', 'PENDING')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(5);

    if (fetchError) throw fetchError;
    if (!queue || queue.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending crawl tasks' });
    }

    const results = [];

    // 2. Proses tiap URL
    for (const task of queue) {
      try {
        // Tandai sedang diproses
        await supabase.from('crawl_queue').update({ status: 'CRAWLING' }).eq('id', task.id);

        const baseUrl = new URL(task.target_url).origin;
        
        // Fetch content
        const res = await fetch(task.target_url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZaditBot/1.0; +https://myprofile.com)' }
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const html = await res.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const newUrls = new Set<string>();
        const detectedFeeds: string[] = [];

        // Deteksi RSS Feeds
        const linkTags = doc.querySelectorAll('link[rel="alternate"]');
        linkTags.forEach(link => {
          const type = link.getAttribute('type');
          const href = link.getAttribute('href');
          if (type && type.includes('rss+xml') && href) {
            try {
              const absUrl = new URL(href, baseUrl).href;
              detectedFeeds.push(absUrl);
            } catch (e) {}
          }
        });

        // Deteksi sitemap link di HTML (kadang ada)
        const sitemapLinks = doc.querySelectorAll('a[href*="sitemap.xml"]');
        sitemapLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href) {
            try {
              const absUrl = new URL(href, baseUrl).href;
              newUrls.add(absUrl);
            } catch (e) {}
          }
        });

        // Bounded Link Expansion
        if (task.depth < MAX_DEPTH) {
          const aTags = doc.querySelectorAll('a[href]');
          aTags.forEach(a => {
            const href = a.getAttribute('href');
            if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
            try {
              const absUrl = new URL(href, baseUrl);
              // Hanya merayapi domain yang sama
              if (absUrl.origin === baseUrl) {
                // Hapus hash
                absUrl.hash = '';
                newUrls.add(absUrl.href);
              }
            } catch (e) {}
          });
        }

        // Simpan feed yang ditemukan ke system_configs jika belum ada
        if (detectedFeeds.length > 0) {
          const { data: configData } = await supabase.from('system_configs').select('value').eq('key', 'rss_feeds').single();
          let currentFeeds = [];
          if (configData && configData.value) {
            currentFeeds = typeof configData.value === 'string' ? JSON.parse(configData.value) : configData.value;
          }
          
          let feedsUpdated = false;
          detectedFeeds.forEach(feedUrl => {
            const exists = currentFeeds.find((f: any) => f.url === feedUrl);
            if (!exists) {
              currentFeeds.push({
                id: Date.now().toString() + Math.floor(Math.random()*1000),
                name: `Auto-detected Feed (${new URL(feedUrl).hostname})`,
                url: feedUrl,
                is_active: true // Auto-approved oleh AI Engine
              });
              feedsUpdated = true;
            }
          });

          if (feedsUpdated) {
            await supabase.from('system_configs').upsert({
              key: 'rss_feeds',
              value: currentFeeds
            }, { onConflict: 'key' });
          }
        }

        // Tambahkan link baru ke antrean
        if (newUrls.size > 0) {
          const insertPayloads = Array.from(newUrls).map(url => ({
            target_url: url,
            normalized_url: url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
            depth: task.depth + 1,
            status: 'PENDING',
            priority: Math.max(0, task.priority - 1)
          }));

          // Upsert untuk menghindari duplikat (mengandalkan unique constraint di database)
          for (const payload of insertPayloads) {
            await supabase.from('crawl_queue').upsert(payload, { onConflict: 'normalized_url,depth', ignoreDuplicates: true });
          }
        }

        // Update status selesai
        await supabase.from('crawl_queue').update({ 
          status: 'CRAWLED', 
          last_crawled_at: new Date().toISOString() 
        }).eq('id', task.id);

        results.push({ url: task.target_url, status: 'CRAWLED', discoveredLinks: newUrls.size, discoveredFeeds: detectedFeeds.length });

      } catch (err: any) {
        console.error(`[Discovery] Failed to crawl ${task.target_url}:`, err);
        await supabase.from('crawl_queue').update({ 
          status: 'FAILED',
          last_crawled_at: new Date().toISOString()
        }).eq('id', task.id);
        results.push({ url: task.target_url, status: 'FAILED', error: err.message });
      }
    }

    return NextResponse.json({ success: true, processed: queue.length, results });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
