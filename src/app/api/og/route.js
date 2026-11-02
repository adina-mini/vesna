import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic parameters with elegant defaults
    const title = searchParams.get('title') || 'Fatima Hafeez & Rao Sharjeel';
    const event = searchParams.get('event') || 'The Royal Barat Celebration';
    const date = searchParams.get('date') || 'Saturday, 7 November 2026';
    const venue = searchParams.get('venue') || 'Rashid Banquet Hall, Karachi';
    const theme = searchParams.get('theme') || 'burgundy';

    // Color theme palettes
    const themes = {
      burgundy: {
        bg: 'linear-gradient(135deg, #180306 0%, #2E070D 50%, #150204 100%)',
        accent: '#D4AF37',
        accentGlow: 'rgba(212, 175, 55, 0.25)',
        border: '#8E6F27',
        badgeBg: 'rgba(212, 175, 55, 0.12)',
        badgeText: '#ECD88C',
      },
      emerald: {
        bg: 'linear-gradient(135deg, #04140D 0%, #0A2619 50%, #03100A 100%)',
        accent: '#5CE1A6',
        accentGlow: 'rgba(92, 225, 166, 0.25)',
        border: '#1E7E52',
        badgeBg: 'rgba(92, 225, 166, 0.12)',
        badgeText: '#A7F3D0',
      },
      noir: {
        bg: 'linear-gradient(135deg, #0A0A0C 0%, #18181D 50%, #070709 100%)',
        accent: '#E5C07B',
        accentGlow: 'rgba(229, 192, 123, 0.25)',
        border: '#7D6331',
        badgeBg: 'rgba(229, 192, 123, 0.12)',
        badgeText: '#F7E3AF',
      },
      gold: {
        bg: 'linear-gradient(135deg, #1C1504 0%, #302409 50%, #161003 100%)',
        accent: '#F3CD68',
        accentGlow: 'rgba(243, 205, 104, 0.3)',
        border: '#A88126',
        badgeBg: 'rgba(243, 205, 104, 0.15)',
        badgeText: '#FDE68A',
      },
    };

    const currentTheme = themes[theme] || themes.burgundy;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: currentTheme.bg,
            padding: '40px 50px',
            fontFamily: 'serif',
            position: 'relative',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '800px',
              height: '420px',
              background: `radial-gradient(circle, ${currentTheme.accentGlow} 0%, rgba(0,0,0,0) 70%)`,
              borderRadius: '50%',
            }}
          />

          {/* Luxury Double Ornamental Border */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '24px',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '26px',
              left: '26px',
              right: '26px',
              bottom: '26px',
              border: `1px dashed rgba(212, 175, 55, 0.35)`,
              borderRadius: '20px',
              display: 'flex',
            }}
          />

          {/* Corner Flourishes */}
          <div style={{ position: 'absolute', top: '34px', left: '38px', color: currentTheme.accent, fontSize: '20px' }}>✦</div>
          <div style={{ position: 'absolute', top: '34px', right: '38px', color: currentTheme.accent, fontSize: '20px' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '34px', left: '38px', color: currentTheme.accent, fontSize: '20px' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '34px', right: '38px', color: currentTheme.accent, fontSize: '20px' }}>✦</div>

          {/* Top Atelier Brand Crest */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '1px',
                background: `linear-gradient(90deg, rgba(0,0,0,0), ${currentTheme.accent})`,
              }}
            />
            <div
              style={{
                fontSize: '14px',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: currentTheme.badgeText,
                fontFamily: 'sans-serif',
                fontWeight: 600,
              }}
            >
              VESNA • DIGITAL INVITATION ATELIER
            </div>
            <div
              style={{
                width: '32px',
                height: '1px',
                background: `linear-gradient(90deg, ${currentTheme.accent}, rgba(0,0,0,0))`,
              }}
            />
          </div>

          {/* Event Category Tag */}
          <div
            style={{
              display: 'flex',
              padding: '6px 20px',
              borderRadius: '9999px',
              background: currentTheme.badgeBg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.accent,
              fontSize: '15px',
              fontFamily: 'sans-serif',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            {event}
          </div>

          {/* Main Couple / Honoree Names */}
          <div
            style={{
              fontSize: title.length > 30 ? '48px' : '62px',
              fontWeight: 700,
              color: '#FAF5EF',
              textAlign: 'center',
              lineHeight: 1.15,
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              maxWidth: '1000px',
              marginBottom: '18px',
            }}
          >
            {title}
          </div>

          {/* Filigree Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '1px',
                background: `linear-gradient(90deg, rgba(0,0,0,0), ${currentTheme.accent})`,
              }}
            />
            <div style={{ color: currentTheme.accent, fontSize: '18px' }}>❖</div>
            <div
              style={{
                width: '120px',
                height: '1px',
                background: `linear-gradient(90deg, ${currentTheme.accent}, rgba(0,0,0,0))`,
              }}
            />
          </div>

          {/* Date & Venue Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '18px',
              fontFamily: 'sans-serif',
              color: '#E7D8C4',
              letterSpacing: '0.05em',
              marginBottom: '26px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🗓</span>
              <span>{date}</span>
            </div>
            <div style={{ color: currentTheme.border }}>•</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📍</span>
              <span>{venue}</span>
            </div>
          </div>

          {/* Bottom Tap to Unveil Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 28px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B59124 100%)',
              color: '#150305',
              fontSize: '13px',
              fontFamily: 'sans-serif',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
            }}
          >
            <span>✦ Tap to Open Interactive Invitation & RSVP ✦</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}

