import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-geist-sans), sans-serif' }}>

      {/* LEFT PANEL */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #0f3320 0%, #1a4d2e 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(245,197,24,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 240, height: 240, borderRadius: '50%', background: 'rgba(245,197,24,0.05)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#0f3320', flexShrink: 0 }}>R</div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>ResQSync</span>
        </div>

        {/* Main text */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.25)', borderRadius: 50, padding: '6px 14px', marginBottom: 24 }}>
            <span style={{ color: '#f5c518', fontSize: 12, fontWeight: 600 }}>🚨 Emergency Platform</span>
          </div>
          <h2 style={{ fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-1.5px' }}>
            Every Second<br /><span style={{ color: '#f5c518', fontStyle: 'italic' }}>Matters.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
            Sign in once, stay connected for months. Your community needs you ready at all times — no repeated logins during emergencies.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, marginBottom: 56 }}>
          {[['2,400+', 'Volunteers'], ['180+', 'NGOs'], ['12,000+', 'Helped']].map(([num, label]) => (
            <div key={label}>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#f5c518', lineHeight: 1 }}>{num}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial card */}
        <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 14 }}>
            "Within 8 minutes of reporting, volunteers were at my door. ResQSync saved my family during the floods."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#0f3320' }}>P</div>
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>Priya Sharma</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Chennai, Tamil Nadu</p>
            </div>
            <div style={{ marginLeft: 'auto', color: '#f5c518', fontSize: 12 }}>★★★★★</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Clerk */}
      <div style={{
        flex: 1,
        background: '#f5f0e8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 64px',
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
  )
}