const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from .env.local
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

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = env.GOOGLE_GEMINI_API_KEY || env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const parser = new Parser();

// Re-implementation of Slop Detector for Node.js environment
const AI_CLICHES = [
  'delve', 'tapestry', 'meticulously', 'furthermore', 'in conclusion',
  'testament', 'beacon', 'nestled', 'showcase', 'leverage', 'utilize',
  'pinnacle', 'demystify', 'game changer', 'revolutionize', 'dive deep',
  'buckle up', 'look no further', 'rich history', 'vibrant landscape',
  'treasure trove'
];

function analyzeSlop(content) {
  if (!content) {
    return { slopScore: 0, isHighSignal: true, matchedCliches: [] };
  }
  const contentLower = content.toLowerCase();
  let score = 0;
  const matchedCliches = [];

  AI_CLICHES.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      score += matches.length * 15;
      matchedCliches.push(`${word} (x${matches.length})`);
    }
  });

  const emptyMdCodeRegex = /```\s*```/g;
  const emptyMdMatches = content.match(emptyMdCodeRegex);
  let emptyBlocksCount = emptyMdMatches ? emptyMdMatches.length : 0;

  const emptyHtmlTagsRegex = /<(code|p|h[1-6]|ul|ol|li)>\s*<\/\1>/gi;
  const emptyHtmlMatches = content.match(emptyHtmlTagsRegex);
  emptyBlocksCount += emptyHtmlMatches ? emptyHtmlMatches.length : 0;

  score += emptyBlocksCount * 25;
  const slopScore = Math.min(100, score);
  const isHighSignal = slopScore < 50;

  return { slopScore, isHighSignal, matchedCliches };
}

async function runIngester() {
  console.log('--- STARTING RSS INGESTION PIPELINE ---');
  
  // 1. Fetch active RSS feeds from configs
  const { data: config, error } = await supabase
    .from('system_configs')
    .select('value')
    .eq('key', 'rss_feeds')
    .maybeSingle();

  if (error) {
    console.error('Error fetching RSS feeds config:', error);
    return;
  }

  let feeds = [];
  if (config && config.value) {
    feeds = typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
  }

  const activeFeeds = feeds.filter(f => f.is_active);
  console.log(`Found ${activeFeeds.length} active RSS feeds.`);

  for (const feed of activeFeeds) {
    console.log(`\nProcessing feed: ${feed.name} (${feed.url})`);
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      console.log(`Feed contains ${parsedFeed.items.length} items.`);

      // Process top 5 latest items
      const itemsToProcess = parsedFeed.items.slice(0, 5);
      
      for (const item of itemsToProcess) {
        const title = (item.title || '').replace(/\s+-\s+.*$/, '').trim();
        const originalUrl = item.link || '';
        
        if (!title || !originalUrl) continue;

        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // Check if exists
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) {
          console.log(`[SKIP] Already exists: ${title}`);
          continue;
        }

        console.log(`[PROCESS] Scraping: ${title}`);
        
        // Scraping content
        let fullText = '';
        let snippet = (item.contentSnippet || item.content || '').substring(0, 200);
        try {
          const res = await fetch(originalUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          if (res.ok) {
            const html = await res.text();
            const dom = new JSDOM(html, { url: originalUrl });
            const reader = new Readability(dom.window.document);
            const article = reader.parse();
            if (article && article.textContent) {
              fullText = article.textContent.trim();
              snippet = fullText.substring(0, 200);
            }
          }
        } catch (scrapeErr) {
          console.warn(`[WARN] Scraping failed for ${originalUrl}:`, scrapeErr.message);
        }

        // Run Slop Detector on scraped text (filter slop-heavy articles early)
        if (fullText) {
          const scrapedSlop = analyzeSlop(fullText);
          if (!scrapedSlop.isHighSignal) {
            console.log(`[REJECT] High AI Slop in source text (${scrapedSlop.slopScore}/100): ${title}`);
            continue;
          }
        }

        // Rewrite using Gemini AI
        let finalHtmlContent = '';
        let metaDescription = snippet.substring(0, 160);
        let semanticKeywords = [slug.replace(/-/g, ' '), 'seo', 'growth marketing'];
        let faqItems = [];
        let isAISuccess = false;

        if (GEMINI_API_KEY && fullText.length > 200) {
          try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const systemInstruction = `Tulis ulang artikel berikut ke dalam Bahasa Indonesia yang profesional, orisinal, menarik, dan informatif. 
Panjang tulisan sekitar 600-800 kata. 
Gunakan struktur Definition-Lead pada 200 kata pertama (contoh: "X adalah Y yang berfungsi untuk Z...").
Bagi artikel menjadi 3-4 subjudul H2.
Tulis artikel dalam format HTML yang bersih (menggunakan <p>, <h2>, <ul>, <ol>).`;

            const model = genAI.getGenerativeModel({ 
              model: 'gemini-2.0-flash-exp',
              systemInstruction: systemInstruction
            });

            const prompt = `Judul: ${title}\n\nKonten Asli:\n${fullText.substring(0, 4000)}`;
            const result = await model.generateContent(prompt);

            const rewrittenText = result.response.text();
            
            // Check Slop on rewritten content
            const rewrittenSlop = analyzeSlop(rewrittenText);
            if (rewrittenSlop.isHighSignal) {
              finalHtmlContent = rewrittenText;
              isAISuccess = true;
              console.log(`[AI SUCCESS] Rewritten article successfully: ${title}`);
            } else {
              console.warn(`[WARN] Rewritten content failed Slop Detector (${rewrittenSlop.slopScore}/100). Falling back.`);
            }
          } catch (aiErr) {
            console.warn('[WARN] AI Rewrite failed, falling back to RSS layout:', aiErr.message);
          }
        }

        // No-AI Fallback Layout
        if (!isAISuccess) {
          finalHtmlContent = `
            <p>${snippet}...</p>
            <div style="margin-top: 30px; display: flex; justify-content: center;">
              <a href="${originalUrl}" target="_blank" rel="nofollow noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background-color: #0d9488; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-family: sans-serif;">
                Baca Selengkapnya di Sumber Asli
              </a>
            </div>
          `;
          faqItems = [
            {
              question: `Di mana artikel asli "${title}" dipublikasikan?`,
              answer: `Artikel ini dipublikasikan secara lengkap di platform media mitra kami. Anda dapat membacanya langsung melalui tautan rujukan resmi di bagian bawah halaman.`
            }
          ];
        }

        // Save article to database
        const { error: insertErr } = await supabase.from('articles').insert({
          title,
          slug,
          source_feed: feed.url,
          original_url: originalUrl,
          content: finalHtmlContent,
          meta_title: `${title} | Zadit Growth Blog`,
          meta_description: metaDescription,
          semantic_keywords: semanticKeywords,
          faq_items: faqItems,
          is_published: true,
          published_at: new Date().toISOString()
        });

        if (insertErr) {
          console.error(`[ERROR] Failed to save article "${title}":`, insertErr.message);
        } else {
          console.log(`[SAVED] successfully: ${title}`);
        }
      }
    } catch (feedErr) {
      console.error(`Error processing feed ${feed.name}:`, feedErr.message);
    }
  }

  console.log('\n--- RSS INGESTION PIPELINE COMPLETED ---');
}

runIngester();
