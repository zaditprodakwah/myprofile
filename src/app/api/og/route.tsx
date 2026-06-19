import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get search parameters
    const title = searchParams.get('title') || 'Zadit Growth Engine';
    const subtitle = searchParams.get('subtitle') || 'Full-Stack Growth Architect & Tech Consultant';
    const type = searchParams.get('type') || 'home';

    // Type badge or category icon mapping
    let badgeText = 'PORTFOLIO';
    if (type === 'blog') badgeText = 'BLOG ARTICLE';
    else if (type === 'directory') badgeText = 'DIRECTORY LISTING';
    else if (type === 'reference') badgeText = 'REFERENCE DATABASE';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0f1923',
            backgroundImage: 'radial-gradient(circle at 90% 10%, #00c8a015 0%, transparent 60%), radial-gradient(circle at 10% 90%, #d4af3710 0%, transparent 60%)',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Top Row: Badge & Branding */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#00c8a0',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                border: '1px solid #00c8a040',
                padding: '6px 16px',
                borderRadius: '4px',
                backgroundColor: '#00c8a010',
              }}
            >
              {badgeText}
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '1px',
              }}
            >
              muhzadit<span style={{ color: '#00c8a0' }}>.app</span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? '48px' : '64px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                letterSpacing: '-1px',
                marginBottom: '20px',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderTop: '1px solid #33415530',
              paddingTop: '30px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#00c8a0',
                  marginRight: '12px',
                }}
              />
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#e2e8f0',
                }}
              >
                Muhammad Khoiruzzadittaqwa
              </span>
            </div>
            <div
              style={{
                fontSize: '16px',
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              zadit.growth.engine
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(`OG image generation error: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
