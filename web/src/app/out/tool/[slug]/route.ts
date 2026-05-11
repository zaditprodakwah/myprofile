import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // 1. Get tool details
  const { data: tool } = await supabase
    .from("tools")
    .select("website_url, affiliate_url")
    .eq("slug", slug)
    .single();

  if (!tool) {
    return NextResponse.redirect(new URL("/tools", req.url));
  }

  // 2. Track click
  await supabase.from("affiliate_clicks").insert({
    tool_slug: slug,
    referrer: req.headers.get("referer") || "direct",
    user_agent: req.headers.get("user-agent") || "unknown"
  });

  // 3. Redirect to affiliate or original URL
  return NextResponse.redirect(tool.affiliate_url || tool.website_url);
}
