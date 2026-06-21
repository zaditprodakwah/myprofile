import { NextResponse } from 'next/server';

function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ success: false, error: 'YouTube URL parameter is required' }, { status: 400 });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ success: false, error: 'Invalid YouTube URL format' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Google API key is not configured' }, { status: 500 });
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`YouTube API returned status: ${res.status}`);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Video not found or is private' }, { status: 404 });
    }

    const videoInfo = data.items[0];
    return NextResponse.json({ success: true, data: videoInfo });
  } catch (err: any) {
    console.error('YouTube Audit API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
