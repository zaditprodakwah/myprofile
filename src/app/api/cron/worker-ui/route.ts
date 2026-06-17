import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { routeLLM } from '@/lib/llm-router';

// Worker 1: Frontend Evolution & UI/UX
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.VERCEL === '1' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Simulated metric evaluation
    // We pass current site configs to AI to suggest a new tagline or CTA
    const { data: configs } = await supabase.from('system_configs').select('*');
    const currentTitle = configs?.find(c => c.key === 'site_title')?.value || 'Zadit Growth Portfolio';
    
    const prompt = `Current Tagline/Title is: "${currentTitle}". Suggest an optimized, high-converting, punchy 3-4 word variation for A/B testing aimed at the Indonesian market. Output JSON: {"new_title": "..."}`;
    
    const aiResponse = await routeLLM('seo', prompt, 'Output ONLY valid JSON.');
    
    let newTitle = currentTitle;
    try {
      const parsed = JSON.parse(aiResponse.match(/\{[\s\S]*\}/)?.[0] || '{}');
      if (parsed.new_title) newTitle = parsed.new_title;
    } catch (e) {
      // fallback
    }

    // In a real advanced setup, we'd update a specific ab_test config key
    // For now, we just log it or store it in an 'ai_recommendations' config
    await supabase.from('system_configs').upsert({
      key: 'ai_recommendations',
      value: { suggested_title: newTitle, last_evaluated: new Date().toISOString() }
    }, { onConflict: 'key' });

    return NextResponse.json({ success: true, message: `Worker-UI Executed. Suggested title: ${newTitle}` });
  } catch (err) {
    console.error('Cron Worker-UI Error:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
