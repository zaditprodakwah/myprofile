export function calculateSignalScore(item: {
  title: string;
  summary: string;
  publishedAt: string;
  sourcePriority: number;
}) {
  let score = item.sourcePriority || 50;

  // 1. Freshness Boost
  const hoursOld = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60);
  if (hoursOld < 12) score += 30;
  else if (hoursOld < 24) score += 25;
  else if (hoursOld < 48) score += 18;
  else if (hoursOld < 168) score += 10; // < 7 days

  // 2. Keyword Boost
  const content = (item.title + " " + item.summary).toLowerCase();
  const boosts = [
    { words: ["seo", "serp", "ranking", "google search"], val: 15 },
    { words: ["ai", "llm", "gpt", "gemini", "llama", "inference"], val: 12 },
    { words: ["engineering", "performance", "architecture", "scale"], val: 10 }
  ];

  boosts.forEach(b => {
    if (b.words.some(w => content.includes(w))) {
      score += b.val;
    }
  });

  // 3. Noise Penalties
  const penalties = [
    { words: ["roundup", "weekly news", "digest"], val: 15 },
    { words: ["podcast", "webinar", "event"], val: 10 },
    { words: ["sponsored", "ad"], val: 20 }
  ];

  penalties.forEach(p => {
    if (p.words.some(w => content.includes(w))) {
      score -= p.val;
    }
  });

  if (item.summary.length < 120) score -= 10;

  return Math.min(100, Math.max(0, score));
}

export function shouldDisplay(score: number) {
  return score >= 55;
}

export function shouldFeature(score: number) {
  return score >= 80;
}
