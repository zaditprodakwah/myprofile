/**
 * Heuristic-based AI Slop & Quality Detector
 * Detects empty code blocks, AI clichés, and formatting issues to compute a quality index.
 */
export interface SlopAnalysis {
  slopScore: number;
  isHighSignal: boolean;
  matchedCliches: string[];
  emptyBlocksCount: number;
}

const AI_CLICHES = [
  'delve',
  'tapestry',
  'meticulously',
  'furthermore',
  'in conclusion',
  'testament',
  'beacon',
  'nestled',
  'showcase',
  'leverage',
  'utilize',
  'pinnacle',
  'demystify',
  'game changer',
  'revolutionize',
  'dive deep',
  'buckle up',
  'look no further',
  'rich history',
  'vibrant landscape',
  'treasure trove'
];

export function analyzeSlop(content: string): SlopAnalysis {
  if (!content) {
    return { slopScore: 0, isHighSignal: true, matchedCliches: [], emptyBlocksCount: 0 };
  }

  const contentLower = content.toLowerCase();
  let score = 0;
  const matchedCliches: string[] = [];

  // 1. Check for AI Clichés
  AI_CLICHES.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      score += matches.length * 15; // 15 points per cliché
      matchedCliches.push(`${word} (x${matches.length})`);
    }
  });

  // 2. Check for empty code blocks or empty formatting tags
  // Empty markdown code blocks
  const emptyMdCodeRegex = /```\s*```/g;
  const emptyMdMatches = content.match(emptyMdCodeRegex);
  let emptyBlocksCount = emptyMdMatches ? emptyMdMatches.length : 0;

  // Empty HTML tags (e.g. <code></code>, <p></p>, <h2></h2>)
  const emptyHtmlTagsRegex = /<(code|p|h[1-6]|ul|ol|li)>\s*<\/\1>/gi;
  const emptyHtmlMatches = content.match(emptyHtmlTagsRegex);
  emptyBlocksCount += emptyHtmlMatches ? emptyHtmlMatches.length : 0;

  score += emptyBlocksCount * 25; // 25 points per empty block

  // Normalize score between 0 and 100
  const slopScore = Math.min(100, score);
  
  // High Signal if slopScore is under 50
  const isHighSignal = slopScore < 50;

  return {
    slopScore,
    isHighSignal,
    matchedCliches,
    emptyBlocksCount
  };
}
