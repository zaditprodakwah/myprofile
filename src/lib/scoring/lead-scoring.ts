export interface LeadData {
  segment: string;
  urgency: string;
  budget_range?: string;
  company?: string;
  goal?: string;
}

export function calculateLeadScore(data: LeadData): number {
  let score = 0;

  // 1. Urgency Scoring
  const urgencyScores: Record<string, number> = {
    today: 40,
    this_week: 25,
    this_month: 15,
    flexible: 5,
  };
  score += urgencyScores[data.urgency] || 0;

  // 2. Segment Scoring (Higher importance to B2B/Marketing for score-based routing)
  if (data.segment === "marketing") score += 20;
  if (data.segment === "business") score += 15;
  if (data.segment === "academic") score += 10;

  // 3. Scale/Budget Scoring (Simplified)
  if (data.budget_range && data.budget_range.includes("M")) score += 25; // High budget signal
  if (data.company) score += 15; // Corporate signal

  return Math.min(score, 100);
}

export function getLeadTier(score: number): "hot" | "warm" | "cold" {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

export function getRecommendedRouting(score: number, urgency: string): "whatsapp" | "resend" | "lead_magnet" {
  if (urgency === "today" || urgency === "this_week") return "whatsapp";
  if (score >= 40) return "resend";
  return "lead_magnet";
}
