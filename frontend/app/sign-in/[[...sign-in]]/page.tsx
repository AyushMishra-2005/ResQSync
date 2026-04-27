import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <>
      <main style={{
        height: '100vh',
        display: 'flex',
        fontFamily: 'var(--font-geist-sans), sans-serif',
        overflow: 'hidden',
      }}>

        {/* LEFT PANEL - scaled down to fit without scroll */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(160deg, #0f3320 0%, #1a4d2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',  // vertically centers the compact content
          padding: '32px 48px',       // reduced from 64px 72px
          position: 'relative',
          overflow: 'hidden',         // no scroll
        }}>
          {/* decorative circles (same, but scaled slightly) */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 250, height: 250, borderRadius: '50%', background: 'rgba(245,197,24,0.07)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,197,24,0.05)' }} />

          {/* Logo - smaller */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 66, height: 66, borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#0f3320', flexShrink: 0 }}>R</div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 60, letterSpacing: '-0.5px' }}>ResQSync</span>
          </div>

          {/* Badge */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.25)', borderRadius: 50, padding: '4px 12px', marginBottom: 16 }}>
              <span style={{ color: '#f5c518', fontSize: 11, fontWeight: 600 }}>🚨 Emergency Platform</span>
            </div>
          </div>

          {/* Main text - reduced font sizes and margin */}
          <h2 style={{ fontSize: 38, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 12, letterSpacing: '-1.5px' }}>
            Every Second<br /><span style={{ color: '#f5c518', fontStyle: 'italic' }}>Matters.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.5, maxWidth: 340, marginBottom: 24 }}>
            Sign in once, stay connected for months. Your community needs you ready at all times — no repeated logins during emergencies.
          </p>

          {/* Stats - reduced numbers and spacing */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 28 }}>
            {[['2,400+', 'Volunteers'], ['180+', 'NGOs'], ['12,000+', 'Helped']].map(([num, label]) => (
              <div key={label}>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#f5c518', lineHeight: 1 }}>{num}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial card - smaller padding and text */}
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 18px' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 10 }}>
              "Within 8 minutes of reporting, volunteers were at my door. ResQSync saved my family during the floods."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#0f3320' }}>P</div>
              <div>
                <p style={{ color: 'white', fontWeight: 600, fontSize: 11 }}>Priya Sharma</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9 }}>Chennai, Tamil Nadu</p>
              </div>
              <div style={{ marginLeft: 'auto', color: '#f5c518', fontSize: 10 }}>★★★★★</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Clerk (unchanged, already compact) */}
        <div style={{
          flex: 1,
          background: '#f5f0e8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 48px',
          overflow: 'hidden',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <p style={{ color: '#4a5568', fontSize: 13, marginBottom: 24, textAlign: 'center' }}>
              Welcome back — sign in to access your emergency dashboard
            </p>
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: '#1a4d2e',
                  colorBackground: '#ffffff',
                  borderRadius: '14px',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                },
                elements: {
                  card: { boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #ede8df' },
                  headerTitle: { color: '#0f3320', fontWeight: 800 },
                  headerSubtitle: { color: '#4a5568' },
                  formButtonPrimary: { background: '#1a4d2e', borderRadius: 50, fontWeight: 700 },
                  footerActionLink: { color: '#1a4d2e', fontWeight: 600 },
                }
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}