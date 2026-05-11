/**
 * Precision Radar Mapping System
 * Translates tags and content keywords into Industry and Problem classifications.
 */

export interface MappingResult {
  industrySlug: string;
  problemSlug: string;
  confidence: number;
}

const industryRules = [
  {
    slug: "ecommerce",
    tags: ["e-commerce", "marketplace", "shopify", "shopee", "tokopedia", "tiktok shop"],
    keywords: ["checkout", "cart", "product page", "conversion rate", "roas", "ads cost"]
  },
  {
    slug: "education",
    tags: ["education", "academic", "research", "university"],
    keywords: ["thesis", "skripsi", "citation", "zotero", "mendeley", "journal", "methodology"]
  },
  {
    slug: "health-beauty",
    tags: ["beauty", "skincare", "health", "wellness"],
    keywords: ["skincare", "cosmetic", "brand reputation", "review", "ugc", "influencer"]
  },
  {
    slug: "saas",
    tags: ["saas", "ai", "software", "developer", "engineering"],
    keywords: ["api", "llm", "openai", "gemini", "github", "auth", "pricing page", "signup"]
  },
  {
    slug: "corporate",
    tags: ["enterprise", "corporate", "business"],
    keywords: ["reporting", "dashboard", "kpi", "sop", "stakeholder", "governance"]
  }
];

const problemRules: Record<string, Array<{ slug: string; keywords: string[] }>> = {
  ecommerce: [
    { slug: "high-cac-low-roas", keywords: ["cac", "roas", "cpm", "ads cost", "conversion drop"] },
    { slug: "landing-page-low-conversion", keywords: ["landing page", "cvr", "conversion rate", "checkout"] },
    { slug: "weak-organic-authority", keywords: ["seo", "ranking", "serp", "organic traffic"] }
  ],
  education: [
    { slug: "low-enrollment", keywords: ["enrollment", "student acquisition", "registration", "conversion"] },
    { slug: "citation-and-writing-system", keywords: ["citation", "apa", "ieee", "zotero", "mendeley"] },
    { slug: "research-methodology-confusion", keywords: ["methodology", "quantitative", "qualitative", "data analysis"] }
  ],
  "health-beauty": [
    { slug: "brand-reputation-risk", keywords: ["reputation", "review", "negative", "backlash", "controversy"] },
    { slug: "campaign-scaling-instability", keywords: ["scaling", "ads", "budget", "roas drop"] }
  ],
  saas: [
    { slug: "programmatic-seo-architecture", keywords: ["programmatic seo", "pseo", "landing pages", "template pages"] },
    { slug: "low-signup-conversion", keywords: ["signup", "activation", "onboarding", "trial conversion"] },
    { slug: "weak-authority-backlinks", keywords: ["backlinks", "authority", "domain rating", "da", "link building"] }
  ],
  corporate: [
    { slug: "messy-reporting-no-kpi", keywords: ["kpi", "reporting", "dashboard", "metrics"] },
    { slug: "brand-authority-fragmented", keywords: ["brand reputation", "pr", "authority", "serp control"] },
    { slug: "documentation-sop-needed", keywords: ["sop", "documentation", "policy", "process"] }
  ]
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function mapRadarItemToSolutions(item: {
  title: string;
  summary: string;
  tags: string[];
}): MappingResult {
  const content = normalize(`${item.title} ${item.summary}`);
  const itemTags = item.tags.map(normalize);
  
  let bestIndustry = "corporate";
  let maxIndustryScore = 0;

  // 1. Industry Detection
  industryRules.forEach(rule => {
    let score = 0;
    rule.tags.forEach(t => { if (itemTags.includes(t)) score += 30; });
    rule.keywords.forEach(k => { if (content.includes(k)) score += 10; });
    
    if (score > maxIndustryScore) {
      maxIndustryScore = score;
      bestIndustry = rule.slug;
    }
  });

  // 2. Problem Detection within Industry
  let bestProblem = "general-optimization";
  let maxProblemScore = 0;
  
  const problems = problemRules[bestIndustry] || [];
  problems.forEach(rule => {
    let score = 0;
    rule.keywords.forEach(k => { if (content.includes(k)) score += 20; });
    
    if (score > maxProblemScore) {
      maxProblemScore = score;
      bestProblem = rule.slug;
    }
  });

  // Fallback for problems if none matched strongly
  if (maxProblemScore === 0) {
    if (content.includes("seo") || content.includes("ranking")) bestProblem = "weak-organic-authority";
    else if (content.includes("marketing") || content.includes("ads")) bestProblem = "high-cac-low-roas";
    else if (content.includes("ai") || content.includes("tech")) bestProblem = "programmatic-seo-architecture";
  }

  return {
    industrySlug: bestIndustry,
    problemSlug: bestProblem,
    confidence: Math.min(maxIndustryScore + maxProblemScore, 100)
  };
}
