import { NextResponse } from "next/server";
import { ingestAllFeeds } from "@/lib/radar/ingestion";

export async function GET(request: Request) {
  // Optional: Simple auth check via header or query param
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await ingestAllFeeds();
    return NextResponse.json({ 
      success: true, 
      count: results.length,
      items: results 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
