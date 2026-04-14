'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const G = {
  dark: '#0f3320',
  main: '#1a4d2e',
  light: '#2d6a4f',
  yellow: '#f5c518',
  cream: '#f5f0e8',
  creamDark: '#ede8df',
  muted: '#6b7280',
}

export default function Dashboard() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [role, setRole] = useState('user')
  const [message, setMessage] = useState('')
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState<'report' | 'requests'>('report')

  useEffect(() => {
    const r = localStorage.getItem('resqsync_role') || 'user'
    setRole(r)
  }, [])

  const getLocation = () => {
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      pos => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationStatus('done') },
      () => setLocationStatus('error')
    )
  }

  const handleSubmit = () => {
    if (!message || !urgency || !location) return
    console.log('Emergency report:', { message, urgency, location, userId: user?.id })
    setSubmitted(true)
  }

  const handleSignOut = async () => { await signOut(); router.push('/') }

  const initials = user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || '?'

  return (
    <div style={{ minHeight: '100vh', background: G.cream, fontFamily: 'var(--font-geist-sans), sans-serif' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ background: G.dark, padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
        {/* Logo pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: G.main, borderRadius: 50, padding: '6px 18px 6px 6px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: G.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: G.dark, marginRight: 8 }}>R</div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>ResQSync</span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Role badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: role === 'ngo' ? G.yellow : 'rgba(255,255,255,0.12)', borderRadius: 50, padding: '5px 14px' }}>
            <span style={{ fontSize: 14 }}>{role === 'ngo' ? '🏥' : '🙋'}</span>
            <span style={{ color: role === 'ngo' ? G.dark : 'white', fontSize: 12, fontWeight: 600 }}>{role === 'ngo' ? 'NGO Admin' : 'Community User'}</span>
          </div>

          {/* Avatar */}
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: G.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: G.dark }}>
            {initials}
          </div>

          {/* Sign out */}
          <button onClick={handleSignOut}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 50, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white' }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          >Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* ── WELCOME ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: G.dark, marginBottom: 4 }}>
            Hello, {user?.firstName || 'Friend'} 👋
          </h1>
          <p style={{ color: G.muted, fontSize: 15 }}>
            {role === 'ngo' ? 'Manage incoming requests and coordinate your volunteers.' : 'Report an emergency or check your active requests.'}
          </p>
        </div>

        {role === 'user' ? (
          <>
            {/* ── TABS ── */}
            <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 14, padding: 4, marginBottom: 24, border: `1px solid ${G.creamDark}`, width: 'fit-content' }}>
              {(['report', 'requests'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '8px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: activeTab === tab ? G.dark : 'transparent', color: activeTab === tab ? 'white' : G.muted }}
                >
                  {tab === 'report' ? '🚨 Report Emergency' : '📋 My Requests'}
                </button>
              ))}
            </div>

            {activeTab === 'report' ? (
              !submitted ? (
                <div style={{ background: 'white', borderRadius: 24, padding: 36, border: `1px solid ${G.creamDark}`, boxShadow: '0 4px 24px rgba(0,0,0,0.04)', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: G.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚨</div>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: G.dark }}>Report an Emergency</h2>
                      <p style={{ fontSize: 13, color: G.muted, marginTop: 2 }}>Describe your situation — help is on the way</p>
                    </div>
                  </div>

                  {/* Message */}
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: G.dark, marginBottom: 8 }}>Describe the situation</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="e.g. There is a flood in our area, we need immediate help with food and medical aid..."
                    rows={4}
                    style={{ width: '100%', borderRadius: 14, padding: '14px 16px', fontSize: 14, resize: 'none', outline: 'none', marginBottom: 24, background: G.cream, border: `1.5px solid ${G.creamDark}`, color: G.dark, fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = G.main}
                    onBlur={e => e.currentTarget.style.borderColor = G.creamDark}
                  />

                  {/* Urgency */}
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: G.dark, marginBottom: 10 }}>Urgency Level</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                    {([
                      { val: 'low', label: 'Low', emoji: '🟢', activeColor: '#16a34a', activeBg: '#dcfce7' },
                      { val: 'medium', label: 'Medium', emoji: '🟡', activeColor: '#d97706', activeBg: '#fef3c7' },
                      { val: 'high', label: 'High', emoji: '🔴', activeColor: '#dc2626', activeBg: '#fee2e2' },
                    ] as const).map(({ val, label, emoji, activeColor, activeBg }) => (
                      <button key={val} onClick={() => setUrgency(val)}
                        style={{ padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: urgency === val ? activeBg : G.cream, color: urgency === val ? activeColor : G.muted, border: urgency === val ? `2px solid ${activeColor}` : `1.5px solid ${G.creamDark}` }}
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>

                  {/* Location */}
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: G.dark, marginBottom: 10 }}>Your Location</label>
                  <button onClick={getLocation}
                    style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', background: locationStatus === 'done' ? '#dcfce7' : G.cream, border: `1.5px solid ${locationStatus === 'done' ? '#16a34a' : G.creamDark}`, color: locationStatus === 'done' ? '#16a34a' : G.muted }}
                  >
                    {locationStatus === 'loading' && <span style={{ width: 16, height: 16, border: `2px solid ${G.main}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
                    {locationStatus === 'idle' && '📍 Detect My Location'}
                    {locationStatus === 'loading' && 'Detecting your location...'}
                    {locationStatus === 'done' && `✓ Captured (${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)})`}
                    {locationStatus === 'error' && '❌ Failed — tap to retry'}
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </button>

                  {/* Submit */}
                  <button onClick={handleSubmit}
                    disabled={!message || !urgency || locationStatus !== 'done'}
                    style={{ width: '100%', padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: message && urgency && locationStatus === 'done' ? 'pointer' : 'not-allowed', transition: 'all 0.2s', background: message && urgency && locationStatus === 'done' ? G.dark : G.creamDark, color: message && urgency && locationStatus === 'done' ? 'white' : G.muted, border: 'none', boxShadow: message && urgency && locationStatus === 'done' ? '0 8px 24px rgba(15,51,32,0.25)' : 'none' }}
                    onMouseOver={e => { if (message && urgency && locationStatus === 'done') e.currentTarget.style.background = G.main }}
                    onMouseOut={e => { if (message && urgency && locationStatus === 'done') e.currentTarget.style.background = G.dark }}
                  >
                    Send Emergency Alert →
                  </button>
                </div>
              ) : (
                <div style={{ background: G.dark, borderRadius: 24, padding: '56px 36px', textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                  <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 8 }}>Alert Sent Successfully!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>Your request has been received and volunteers are being matched to your location right now.</p>
                  <button onClick={() => setSubmitted(false)}
                    style={{ background: G.yellow, color: G.dark, border: 'none', padding: '14px 36px', borderRadius: 50, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
                  >Send Another Report →</button>
                </div>
              )
            ) : (
              /* MY REQUESTS TAB */
              <div style={{ background: 'white', borderRadius: 24, padding: 28, border: `1px solid ${G.creamDark}` }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: G.dark, marginBottom: 20 }}>Your Active Requests</h2>
                <div style={{ textAlign: 'center', padding: '48px 24px', color: G.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: G.dark }}>No active requests</p>
                  <p style={{ fontSize: 13, marginTop: 6 }}>Your submitted emergency reports will appear here.</p>
                </div>
              </div>
            )}

            {/* QUICK STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 8 }}>
              {[
                { icon: '📋', label: 'My Requests', val: '0', color: G.dark },
                { icon: '🤝', label: 'Volunteers Nearby', val: '—', color: G.main },
                { icon: '⚡', label: 'Avg Response', val: '~12 min', color: '#d97706' },
              ].map(({ icon, label, val, color }) => (
                <div key={label} style={{ background: 'white', borderRadius: 18, padding: '20px 16px', textAlign: 'center', border: `1px solid ${G.creamDark}` }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <p style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: 11, color: G.muted, marginTop: 5 }}>{label}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ── NGO ADMIN VIEW ── */
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { icon: '🚨', label: 'Active Alerts', val: '7', color: '#dc2626', bg: '#fee2e2' },
                { icon: '🤝', label: 'Volunteers', val: '34', color: G.main, bg: '#dcfce7' },
                { icon: '✅', label: 'Resolved Today', val: '12', color: '#16a34a', bg: '#dcfce7' },
                { icon: '⏱', label: 'Avg Response', val: '~12m', color: '#d97706', bg: '#fef3c7' },
              ].map(({ icon, label, val, color, bg }) => (
                <div key={label} style={{ background: 'white', borderRadius: 18, padding: '22px 16px', textAlign: 'center', border: `1px solid ${G.creamDark}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 12px' }}>{icon}</div>
                  <p style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: 11, color: G.muted, marginTop: 5 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Incoming requests */}
            <div style={{ background: 'white', borderRadius: 24, border: `1px solid ${G.creamDark}`, overflow: 'hidden' }}>
              <div style={{ padding: '20px 28px', borderBottom: `1px solid ${G.creamDark}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: G.dark }}>🚨 Incoming Requests</h2>
                <span style={{ fontSize: 12, background: '#fee2e2', color: '#dc2626', padding: '3px 12px', borderRadius: 20, fontWeight: 700 }}>7 Active</span>
              </div>

              {[
                { name: 'Ravi Kumar', location: 'Sector 4, Chennai', msg: 'Flood damage, need food and shelter immediately', urgency: 'high', time: '2 min ago', volunteers: 3 },
                { name: 'Priya Sharma', location: 'Adyar, Chennai', msg: 'Medical emergency, elderly patient needs help', urgency: 'high', time: '8 min ago', volunteers: 1 },
                { name: 'Mohammed Ali', location: 'T.Nagar, Chennai', msg: 'Power outage, need generator and supplies', urgency: 'medium', time: '15 min ago', volunteers: 2 },
                { name: 'Anita Desai', location: 'Velachery, Chennai', msg: 'Clean water shortage in residential colony', urgency: 'low', time: '32 min ago', volunteers: 5 },
              ].map((req, i, arr) => (
                <div key={i} style={{ padding: '18px 28px', borderBottom: i < arr.length - 1 ? `1px solid ${G.creamDark}` : 'none', display: 'flex', alignItems: 'center', gap: 16, transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = G.cream}
                  onMouseOut={e => e.currentTarget.style.background = 'white'}
                >
                  {/* Avatar */}
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: G.cream, border: `2px solid ${G.creamDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: G.dark, flexShrink: 0 }}>
                    {req.name[0]}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: G.dark }}>{req.name}</p>
                      <span style={{ fontSize: 11, color: G.muted }}>· 📍 {req.location}</span>
                    </div>
                    <p style={{ fontSize: 13, color: G.muted, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.msg}</p>
                    <p style={{ fontSize: 11, color: G.muted }}>🤝 {req.volunteers} volunteers matched · {req.time}</p>
                  </div>
                  {/* Urgency badge */}
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20, flexShrink: 0, background: req.urgency === 'high' ? '#fee2e2' : req.urgency === 'medium' ? '#fef3c7' : '#dcfce7', color: req.urgency === 'high' ? '#dc2626' : req.urgency === 'medium' ? '#d97706' : '#16a34a' }}>
                    {req.urgency.toUpperCase()}
                  </span>
                  {/* Assign button */}
                  <button style={{ background: G.dark, color: 'white', border: 'none', padding: '8px 18px', borderRadius: 50, fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = G.main}
                    onMouseOut={e => e.currentTarget.style.background = G.dark}
                  >Assign →</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}