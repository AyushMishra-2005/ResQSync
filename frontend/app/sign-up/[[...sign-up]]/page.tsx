import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
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
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(245,197,24,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 240, height: 240, borderRadius: '50%', background: 'rgba(245,197,24,0.05)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#0f3320' }}>R</div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>ResQSync</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.25)', borderRadius: 50, padding: '6px 14px', marginBottom: 24 }}>
            <span style={{ color: '#f5c518', fontSize: 12, fontWeight: 600 }}>🤝 Join The Network</span>
          </div>
          <h2 style={{ fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-1.5px' }}>
            Be Ready<br /><span style={{ color: '#f5c518', fontStyle: 'italic' }}>When It Counts.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
            Create your account in 30 seconds. Whether you need help or want to volunteer — ResQSync connects you instantly.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '⚡', text: 'Get matched with volunteers in under 10 minutes' },
            { icon: '📍', text: 'Auto location detection — no typing required' },
            { icon: '🔒', text: 'Stay signed in for months — always ready' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,197,24,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
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
            Create your free account and join the emergency network
          </p>
          <SignUp
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