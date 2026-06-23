import { NextResponse } from 'next/server';
import { getEntities } from '@/lib/data-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ citySlug: string }> }
) {
  try {
    const { citySlug } = await params;
    if (!citySlug) {
      return new NextResponse('City slug is required', { status: 400 });
    }

    const entities = await getEntities(citySlug);
    return NextResponse.json({ success: true, data: entities });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entities' },
      { status: 500 }
    );
  }
}
