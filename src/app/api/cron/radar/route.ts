import { NextResponse } from "next/server";
import { runIngestion } from "@/lib/radar/ingestion";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Verify cron secret
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await runIngestion();
    return NextResponse.json({
      success: true,
      message: "Ingestion pipeline completed",
      summary: results
    });
  } catch (error: any) {
    console.error("Cron Ingestion Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
