import { supabaseAdmin as supabase } from "@/lib/supabase/admin";

export const CAPS = {
  TIER_1: 6,
  TIER_2: 4,
  TIER_3: 2
};

export async function checkDailyCap(sourceSlug: string, tier: number): Promise<boolean> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("radar_items")
    .select("*", { count: "exact", head: true })
    .eq("source_slug", sourceSlug)
    .gte("created_at", startOfDay.toISOString());

  const cap = tier === 1 ? CAPS.TIER_1 : tier === 2 ? CAPS.TIER_2 : CAPS.TIER_3;
  
  return (count || 0) < cap;
}

export function enforceDiversity(items: any[]) {
  // Simple diversity enforcement: Ensure no more than 40% of the top items have the same primary tag
  const tagCounts: Record<string, number> = {};
  return items.filter(item => {
    const primaryTag = item.tags?.[0] || "General";
    tagCounts[primaryTag] = (tagCounts[primaryTag] || 0) + 1;
    
    if (tagCounts[primaryTag] > 3) return false; // Max 3 items per tag in a single batch
    return true;
  });
}
