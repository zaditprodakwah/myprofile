import { supabaseAdmin as supabase } from "@/lib/supabase/admin";
import { calculateSignalScore, shouldDisplay } from "./scoring";
import { inferTags } from "./tagging";
import { checkDailyCap, enforceDiversity } from "./curation";
import { getRecommendedSolutions } from "./linking";
import { getSynthesis } from "@/lib/ai/synthesis";
import crypto from "crypto";

export async function ingestAllFeeds() {
  // 1. Fetch enabled sources from DB
  const { data: sources } = await supabase
    .from("radar_sources")
    .select("*")
    .eq("enabled", true);

  if (!sources) return [];

  const results = [];

  for (const source of sources) {
    try {
      // Check daily cap first
      const canIngest = await checkDailyCap(source.slug, source.tier);
      if (!canIngest) continue;

      const response = await fetch(source.url);
      const xml = await response.text();
      const rawItems = parseRSS(xml); // Utility function assumed to be available or refactored

      // Score and Filter
      const processedItems = rawItems.map(raw => {
        const score = calculateSignalScore({
          title: raw.title,
          summary: raw.description,
          publishedAt: raw.pubDate,
          sourcePriority: source.priority
        });
        
        return { ...raw, score };
      }).filter(item => shouldDisplay(item.score));

      console.log(`Processing ${processedItems.length} items for ${source.name}...`);

      // Diversify
      const finalItems = enforceDiversity(processedItems).slice(0, 3);

      for (const item of finalItems) {
        const slug = slugify(item.title);
        const hash = crypto.createHash('sha256').update(item.link || item.title).digest('hex');

        // Deduplicate via hash
        const { data: existing } = await supabase
          .from("radar_items")
          .select("id")
          .eq("hash", hash)
          .single();

        if (existing) {
          console.log(`Skipping existing item: ${item.title}`);
          continue;
        }

        const tags = inferTags(item.title, item.description);
        const solutions = getRecommendedSolutions(tags);

        // AI Synthesis (Optional/Background)
        let synthesis = { intro: "", outro: "" };
        try {
          synthesis = await getSynthesis(item.title, tags[0] || "General");
        } catch (e) {
          console.error("Synthesis failed for item, using fallback:", e);
          synthesis = {
            intro: `Update terbaru mengenai ${item.title} memberikan sinyal penting bagi industri.`,
            outro: `Rekomendasi: Tinjau implikasi ini pada strategi ${tags[0] || 'operasional'} Anda.`
          };
        }

        const insertData = {
          slug,
          hash,
          source_slug: source.slug,
          source_name: source.name,
          category: source.category || 'general',
          title: item.title,
          url: item.link,
          published_at: new Date(item.pubDate || Date.now()).toISOString(),
          summary: item.description,
          signal_score: item.score,
          tags,
          why_it_matters: synthesis?.intro || "",
          takeaway: synthesis?.outro || "",
          recommended_solutions: solutions,
          is_featured: item.score >= 80
        };

        const { error } = await supabase.from("radar_items").insert(insertData);

        if (error) {
          console.error(`Error inserting radar item "${item.title}":`, error);
        } else {
          console.log(`Successfully ingested: ${item.title}`);
          results.push({ title: item.title, score: item.score });
        }
      }
    } catch (e) {
      console.error(`Ingestion failed for ${source.name}:`, e);
    }
  }

  return results;
}

function parseRSS(xml: string) {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    items.push({
      title: content.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] || "",
      link: content.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)?.[1] || "",
      description: content.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || "",
      pubDate: content.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || ""
    });
  }
  return items;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}
