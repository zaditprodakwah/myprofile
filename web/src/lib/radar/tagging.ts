const TAG_MAP: Record<string, string[]> = {
  "SEO": ["seo", "serp", "search", "google", "bing", "indexing", "ranking"],
  "AI": ["ai", "llm", "gpt", "generative", "machine learning", "automation"],
  "Engineering": ["performance", "latency", "architecture", "scale", "infrastructure"],
  "Marketing": ["roas", "conversion", "cro", "funnel", "growth", "advertising"],
  "Research": ["paper", "academic", "study", "citation", "evaluation"]
};

export function inferTags(title: string, summary: string): string[] {
  const content = (title + " " + summary).toLowerCase();
  const foundTags = new Set<string>();

  Object.entries(TAG_MAP).forEach(([tag, keywords]) => {
    if (keywords.some(k => content.includes(k))) {
      foundTags.add(tag);
    }
  });

  return Array.from(foundTags);
}
