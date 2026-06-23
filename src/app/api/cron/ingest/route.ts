import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';
import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

export const maxDuration = 60; // 60s timeout for Vercel Cron

// Simple Spintax Engine for content variability
function processSpintax(text: string): string {
  if (!text) return '';
  const spintaxRegex = /\{([^{}]*)\}/g;
  let matches = text.match(spintaxRegex);
  let result = text;
  while (matches) {
    result = result.replace(spintaxRegex, (match, contents) => {
      const options = contents.split('|');
      return options[Math.floor(Math.random() * options.length)];
    });
    matches = result.match(spintaxRegex); 
  }
  return result;
}

// Helper to generate hash for idempotency check
function generateHash(content: string) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'zadit_cron_secret_2026';
  
  if (process.env.VERCEL === '1') {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  try {
    const { data: config, error: configErr } = await supabase
      .from('system_configs')
      .select('value')
      .eq('key', 'rss_feeds')
      .maybeSingle();

    if (configErr) throw new Error(`Failed to load RSS config: ${configErr.message}`);

    let feeds: any[] = [];
    if (config && config.value) {
      feeds = typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
    }

    const activeFeeds = feeds.filter(f => f.is_active);
    if (activeFeeds.length === 0) {
      return NextResponse.json({ success: true, message: 'No active RSS feeds.' });
    }

    const parser = new Parser();
    let totalCreated = 0;
    let totalSkipped = 0;

    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

    for (const feed of activeFeeds) {
      try {
        const parsedFeed = await parser.parseURL(feed.url);
        // Process up to 3 items per feed to avoid timeouts
        const itemsToProcess = parsedFeed.items.slice(0, 3);

        for (const item of itemsToProcess) {
          const title = (item.title || '').replace(/\s+-\s+.*$/, '').trim();
          const originalUrl = item.link || '';
          
          let featuredImage = item.enclosure?.url || '';
          if (!featuredImage && item.content) {
            const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) featuredImage = imgMatch[1];
          }

          if (!title || !originalUrl) continue;

          // 1. Idempotency Check (by URL and slug)
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .or(`slug.eq.${slug},original_url.eq.${originalUrl}`)
            .maybeSingle();

          if (existing) {
            totalSkipped++;
            continue;
          }

          // 2. Fetch and extract original content
          let fullText = '';
          let snippet = (item.contentSnippet || item.content || '').substring(0, 300);
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            const res = await fetch(originalUrl, {
              signal: controller.signal,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              }
            });
            clearTimeout(timeoutId);

            if (res.ok) {
              const html = await res.text();
              const dom = new JSDOM(html, { url: originalUrl });
              const reader = new Readability(dom.window.document);
              const article = reader.parse();
              if (article && article.textContent) {
                fullText = article.textContent.trim();
                snippet = fullText.substring(0, 300);
              }
            }
          } catch (scrapeErr) {
            console.warn(`Scrape failed for ${originalUrl}:`, scrapeErr);
          }

          // 3. Spintax the content if it's too simple or to add variability
          let finalHtmlContent = `
            <p>${processSpintax('{Dilansir dari|Berdasarkan laporan|Menurut sumber}')} artikel aslinya, ${snippet}...</p>
            <div style="margin-top: 30px; display: flex; justify-content: center;">
              <a href="${originalUrl}" target="_blank" rel="nofollow noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background-color: #0d9488; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-family: sans-serif;">
                {Baca Selengkapnya di Sumber Asli|Kunjungi Artikel Penuh|Lihat Referensi Resmi}
              </a>
            </div>
          `;
          finalHtmlContent = processSpintax(finalHtmlContent);

          let metaDescription = processSpintax(snippet).substring(0, 160);
          let semanticKeywords = [slug.replace(/-/g, ' '), 'berita', 'update'];
          if (item.categories && Array.isArray(item.categories)) {
            const extractedCats = item.categories.map((c: any) => typeof c === 'string' ? c : (c._ || c.$?.text || '')).filter(Boolean);
            semanticKeywords = [...new Set([...semanticKeywords, ...extractedCats])];
          }

          let faqItems: Array<{ question: string; answer: string }> = [
            {
              question: `Di mana artikel asli "${title}" dipublikasikan?`,
              answer: `Artikel ini dipublikasikan secara lengkap di platform media mitra kami. Anda dapat membacanya langsung melalui tautan rujukan resmi di bagian bawah halaman.`
            }
          ];

          const wordCount = fullText ? fullText.split(/\s+/).length : (snippet.split(/\s+/).length || 1);
          const readingTime = Math.max(1, Math.ceil(wordCount / 200));

          // 4. AI Polishing & Graphing (Not rewriting, just generating metadata/FAQs)
          if (geminiKey && fullText.length > 200) {
            try {
              const genAI = new GoogleGenerativeAI(geminiKey);
              const model = genAI.getGenerativeModel({ 
                model: 'gemini-2.5-flash',
                systemInstruction: `Tugas Anda adalah mem-polish metadata artikel. Hasilkan JSON dengan struktur: { "metaDescription": "string (maks 150 char)", "semanticKeywords": ["word1", "word2"], "faqItems": [{"question": "...", "answer": "..."}] }`,
                generationConfig: {
                  responseMimeType: "application/json",
                }
              });

              const prompt = `Judul: ${title}\nKonten: ${fullText.substring(0, 1500)}\n\nKeluarkan JSON saja.`;
              const result = await model.generateContent(prompt);
              const textRes = result.response.text();
              
              try {
                const parsed = JSON.parse(textRes);
                if (parsed.metaDescription) metaDescription = parsed.metaDescription;
                if (parsed.semanticKeywords && Array.isArray(parsed.semanticKeywords)) semanticKeywords = parsed.semanticKeywords;
                if (parsed.faqItems && Array.isArray(parsed.faqItems)) faqItems = parsed.faqItems;
              } catch (parseErr) {
                console.warn('Failed to parse AI JSON', parseErr);
              }
            } catch (aiErr) {
              console.warn('AI Polishing failed:', aiErr);
            }
          }

          // Idempotency hash payload
          const payloadHash = generateHash(title + originalUrl);

          // 5. Insert into articles table
          const { error: insertErr } = await supabase.from('articles').insert({
            title,
            slug,
            source_feed: feed.url,
            original_url: originalUrl,
            content: finalHtmlContent,
            meta_title: `${title} | Sovereign`,
            meta_description: metaDescription,
            semantic_keywords: semanticKeywords,
            faq_items: faqItems,
            author_name: feed.name,
            featured_image: featuredImage,
            reading_time: readingTime,
            is_agc: true,
            view_count: Math.floor(Math.random() * 50) + 10,
            is_published: true,
            published_at: new Date().toISOString(),
            content_hash: payloadHash // Assuming we might add this later, ignoring strict type checking here or adding custom field
          });

          if (insertErr) {
            console.error(`Failed to insert article ${title}:`, insertErr.message);
          } else {
            totalCreated++;
          }
        }
      } catch (feedErr) {
        console.error(`Feed processing error for ${feed.name}:`, feedErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `RSS Ingest Cron completed successfully. Created: ${totalCreated}, Skipped: ${totalSkipped}`
    });
  } catch (err: any) {
    console.error('RSS Ingest Cron Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
