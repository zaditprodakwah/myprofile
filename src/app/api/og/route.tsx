import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Zadit Growth Engine';
    const subtitle = searchParams.get('subtitle') || 'Full-Stack Growth Architect';
    const type = searchParams.get('type') || 'home';

    // Premium OLED Black theme styling with dynamic radial background
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
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.15), transparent 60%), radial-gradient(circle at 20% 80%, rgba(217, 119, 6, 0.08), transparent 50%)',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Brand Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                borderRadius: '12px',
                backgroundColor: '#0d9488',
                color: '#f8fafc',
                padding: '10px 20px',
                fontSize: '28px',
                fontWeight: 900,
              }}
            >
              Z
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '20px', color: '#f1f5f9', fontWeight: 700, letterSpacing: '-0.05em' }}>
                Zadit Growth Engine
              </span>
              <span style={{ fontSize: '12px', color: '#0d9488', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {type}
              </span>
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer Metadata */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '32px',
            }}
          >
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ARCHITECT</span>
                <span style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 600 }}>M. K. Zadittaqwa</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STATUS</span>
                <span style={{ fontSize: '14px', color: '#0d9488', fontWeight: 600 }}>VERIFIED CONSOLE</span>
              </div>
            </div>
            <span style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>
              muhzadit.vercel.app
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
