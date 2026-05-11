interface TagMapping {
  keywords: string[];
  solutionSlugs: string[];
}

const RADAR_TO_SOLUTION_MAP: TagMapping[] = [
  { 
    keywords: ["SEO", "SERP", "ranking"], 
    solutionSlugs: ["low-signup-conversion"] // Mapping to marketing conversion problems
  },
  { 
    keywords: ["Research", "Academic", "citation"], 
    solutionSlugs: ["citation-management-chaos"] 
  },
  { 
    keywords: ["Business", "Reporting", "BI", "Analytics"], 
    solutionSlugs: ["manual-reporting-bottleneck"] 
  },
  { 
    keywords: ["AI", "automation", "LPU"], 
    solutionSlugs: ["manual-reporting-bottleneck"] 
  }
];

export function getRecommendedSolutions(tags: string[]): string[] {
  const slugs = new Set<string>();
  const normalizedTags = tags.map(t => t.toLowerCase());

  RADAR_TO_SOLUTION_MAP.forEach(map => {
    if (map.keywords.some(k => normalizedTags.includes(k.toLowerCase()))) {
      map.solutionSlugs.forEach(s => slugs.add(s));
    }
  });

  return Array.from(slugs).slice(0, 2);
}
