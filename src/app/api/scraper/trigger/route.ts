import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper for verifying secret
function verifySecret(req: Request, bodySecret?: string) {
  const envSecret = process.env.ADMIN_SECRET_KEY;
  if (!envSecret) return true; // If no secret configured, bypass

  // Check header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${envSecret}`) return true;

  // Check body
  if (bodySecret && bodySecret === envSecret) return true;

  // Check URL param
  const url = new URL(req.url);
  if (url.searchParams.get('secret') === envSecret) return true;

  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    if (!verifySecret(req, body.secret)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { queueId } = body;
    if (!queueId) {
      return NextResponse.json({ success: false, error: 'queueId is required' }, { status: 400 });
    }

    // 1. Fetch the queue item
    const { data: queueItem, error: fetchError } = await supabase
      .from('scraping_queues')
      .select('*')
      .eq('id', queueId)
      .single();

    if (fetchError || !queueItem) {
      return NextResponse.json({ success: false, error: 'Queue item not found' }, { status: 404 });
    }

    // 2. Update status to in_progress
    await supabase
      .from('scraping_queues')
      .update({ status: 'in_progress' })
      .eq('id', queueId);

    // 3. Trigger actual scraper asynchronously
    // This could call Outscraper, local Playwright script, or add to a background worker
    // For now, we simulate an asynchronous trigger.
    
    // Asynchronous self-invoking function to avoid blocking the HTTP response
    (async () => {
      try {
        console.log(`[Scraper Engine] Starting scrape for queue ${queueId}: ${queueItem.target_query} at ${queueItem.location}`);
        
        // Simulating work...
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Update progress log
        const newLog = [...(queueItem.progress_log || []), {
          time: new Date().toISOString(),
          message: `Scraping completed for ${queueItem.target_query}`
        }];

        await supabase
          .from('scraping_queues')
          .update({ 
            status: 'completed',
            progress_log: newLog
          })
          .eq('id', queueId);
          
      } catch (err: any) {
        console.error('[Scraper Engine] Failed:', err);
        await supabase
          .from('scraping_queues')
          .update({ 
            status: 'failed',
            progress_log: [...(queueItem.progress_log || []), { time: new Date().toISOString(), error: err.message }]
          })
          .eq('id', queueId);
      }
    })();

    return NextResponse.json({ 
      success: true, 
      message: 'Scraping job triggered in the background',
      queueId 
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
