import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { slug, type } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    if (type === 'reference') {
      const { error } = await supabaseServer.rpc('increment_reference_views', { ref_slug: slug });
      if (error) throw error;
    } else {
      const { error } = await supabaseServer.rpc('increment_article_views', { article_slug: slug });
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error incrementing view count:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
