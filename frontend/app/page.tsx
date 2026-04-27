'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (isLoaded && isSignedIn) router.push('/dashboard')
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goAs = (role: 'user' | 'ngo') => {
    localStorage.setItem('resqsync_role', role)
    router.push('/sign-in')
  }

  if (!isLoaded) return (
    <div style={{ minHeight: '100vh', background: '#0f3320', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '4px solid #f5c518', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), sans-serif', background: '#f5f0e8', color: '#1a1a1a', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'white',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #ede8df' : '1px solid #ede8df',
        padding: '0 56px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        {/* Logo pill — Donex style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#0f3320', borderRadius: 50, padding: '7px 20px 7px 7px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#0f3320', marginRight: 10 }}>R</div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>ResQSync</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[['Home', '#'], ['About Us', '#about'], ['Services', '#features'], ['How It Works', '#how-it-works'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href}
              style={{ color: label === 'Home' ? '#0f3320' : '#6b7280', fontSize: 14, fontWeight: label === 'Home' ? 700 : 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#0f3320'}
              onMouseOut={e => e.currentTarget.style.color = label === 'Home' ? '#0f3320' : '#6b7280'}
            >{label}</a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => goAs('user')}
            style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 16px' }}
            onMouseOver={e => e.currentTarget.style.color = '#0f3320'}
            onMouseOut={e => e.currentTarget.style.color = '#6b7280'}
          >Sign In</button>
          <button onClick={() => goAs('user')}
            style={{ background: '#f5c518', color: '#0f3320', border: 'none', padding: '10px 24px', borderRadius: 50, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(245,197,24,0.4)', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,197,24,0.5)' }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,197,24,0.4)' }}
          >🚨 Get Help Now</button>
        </div>
      </nav>
      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f3320 0%, #1a4d2e 60%, #2d6a4f 100%)', minHeight: '100vh', paddingTop: 72, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(245,197,24,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,197,24,0.06)', pointerEvents: 'none' }} />
        {/* yellow squares decor like Donex */}
        <div style={{ position: 'absolute', top: '20%', left: '3%', width: 22, height: 22, background: '#f5c518', borderRadius: 4, transform: 'rotate(20deg)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', top: '30%', left: '5%', width: 14, height: 14, background: '#f5c518', borderRadius: 3, transform: 'rotate(35deg)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '4%', width: 18, height: 18, background: '#f5c518', borderRadius: 3, transform: 'rotate(15deg)', opacity: 0.6 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px', display: 'flex', alignItems: 'center', gap: 80, width: '100%' }}>
          {/* LEFT */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.3)', borderRadius: 50, padding: '6px 16px', marginBottom: 28 }}>
              <span style={{ color: '#f5c518', fontSize: 13, fontWeight: 600 }}>❤️ Welcome to ResQSync!</span>
            </div>
            <h1 style={{ fontSize: 72, fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px' }}>
              We Connect<br />
              <span style={{ color: '#f5c518', fontStyle: 'italic' }}>Volunteers</span><br />
              With Communities
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Smart AI-powered emergency coordination platform. Report a crisis, get matched with the nearest volunteers in minutes — not hours.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
              <button onClick={() => goAs('user')} style={{ background: '#f5c518', color: '#0f3320', border: 'none', padding: '16px 36px', borderRadius: 50, fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 8px 32px rgba(245,197,24,0.35)' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >🚨 Get Help Now</button>
              <button onClick={() => goAs('ngo')} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '16px 36px', borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#f5c518'; e.currentTarget.style.color = '#f5c518' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'white' }}
              >🏥 Join as NGO</button>
            </div>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: 48 }}>
              {[['340+', 'Volunteers'], ['28', 'NGOs'], ['1,200+', 'People Helped'], ['~12 min', 'Avg Response']].map(([num, label]) => (
                <div key={label}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: '#f5c518', lineHeight: 1 }}>{num}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — floating cards */}
          <div style={{ flex: 1, position: 'relative', minHeight: 480, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
            {/* Big card */}
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, background: '#f5c518', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚨</div>
                <div>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Emergency Alert</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Flood in Sector 4, Chennai</p>
                </div>
                <span style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>HIGH</span>
              </div>
              <div style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>🤝</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>5 volunteers matched within 800m</span>
              </div>
            </div>
            {/* Two small cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#f5c518' }}>94%</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>Requests Resolved</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#f5c518' }}>24/7</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>Always Active</p>
              </div>
            </div>
            {/* Live ping card */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>3 new emergencies resolved in the last hour</span>
            </div>
          </div>
        </div>

        {/* brush stroke bottom edge like Donex */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 60, background: '#f5f0e8', clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 80, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,77,46,0.1)', borderRadius: 50, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ color: '#1a4d2e', fontSize: 13, fontWeight: 600 }}>❤️ Our About Us</span>
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f3320', lineHeight: 1.15, marginBottom: 20 }}>We Are Dedicated To<br />Smart Crisis Response.</h2>
          <p style={{ color: '#4a5568', lineHeight: 1.8, fontSize: 15, marginBottom: 28 }}>
            ResQSync is an AI-powered emergency coordination platform that eliminates the chaos of crisis response. When disaster strikes, every second matters — our system intelligently routes help to where it's needed most.
          </p>
          {['AI-powered priority ranking of emergencies', 'Real-time volunteer-to-victim proximity matching', '25,000+ community members already protected'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1a4d2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#f5c518', fontSize: 12 }}>✓</span>
              </div>
              <span style={{ color: '#1a1a1a', fontSize: 14, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop: 36, display: 'flex', gap: 16 }}>
            <button onClick={() => goAs('user')} style={{ background: '#1a4d2e', color: 'white', border: 'none', padding: '14px 30px', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>About More →</button>
            <button style={{ background: 'transparent', color: '#1a4d2e', border: '2px solid #1a4d2e', padding: '14px 30px', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              ▶ Watch Video
            </button>
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: '🚨', bg: '#0f3320', color: 'white', title: 'Emergency Reports', val: '12,400+' },
            { icon: '🤝', bg: '#f5c518', color: '#0f3320', title: 'Volunteers Active', val: '2,400+' },
            { icon: '🏥', bg: '#f5f0e8', color: '#0f3320', title: 'Partner NGOs', val: '180+' },
            { icon: '⚡', bg: '#f5f0e8', color: '#0f3320', title: 'Avg Response Time', val: '6 min' },
          ].map(({ icon, bg, color, title, val }) => (
            <div key={title} style={{ background: bg, borderRadius: 20, padding: '28px 24px', border: bg === '#f5f0e8' ? '1.5px solid #ede8df' : 'none' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <p style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: 13, color: bg === '#0f3320' ? 'rgba(255,255,255,0.6)' : bg === '#f5c518' ? 'rgba(0,0,0,0.6)' : '#4a5568', marginTop: 6 }}>{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="features" style={{ background: '#f0ebe0', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,77,46,0.1)', borderRadius: 50, padding: '6px 16px', marginBottom: 16 }}>
              <span style={{ color: '#1a4d2e', fontSize: 13, fontWeight: 600 }}>⚡ What We Do</span>
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f3320', lineHeight: 1.15 }}>We Provide Help Through<br />Our Smart Platform.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: '🌊', title: 'Flood Response', desc: 'Immediate coordination of rescue teams and supply distribution for flood-affected communities.', featured: false },
              { icon: '🏥', title: 'Medical Aid', desc: 'Connect patients with nearby medical volunteers and NGO health workers within minutes.', featured: true },
              { icon: '🍱', title: 'Food & Nutrition', desc: 'Ensure no family goes hungry by routing food banks and meal distribution volunteers efficiently.', featured: false },
            ].map(({ icon, title, desc, featured }) => (
              <div key={title} style={{
                background: featured ? '#1a4d2e' : 'white',
                borderRadius: 24, overflow: 'hidden',
                border: featured ? 'none' : '1.5px solid #ede8df',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ height: 180, background: featured ? 'rgba(255,255,255,0.08)' : '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                  {icon}
                </div>
                <div style={{ padding: '28px 28px 32px' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: featured ? 'white' : '#0f3320', marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: featured ? 'rgba(255,255,255,0.65)' : '#4a5568', lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>
                  <button onClick={() => goAs('user')} style={{ background: featured ? '#f5c518' : 'transparent', color: featured ? '#0f3320' : '#1a4d2e', border: featured ? 'none' : '2px solid #1a4d2e', padding: '10px 24px', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {featured ? 'Learn More →' : 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,77,46,0.1)', borderRadius: 50, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ color: '#1a4d2e', fontSize: 13, fontWeight: 600 }}>🔄 How It Works</span>
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f3320' }}>Help Reaches You In Minutes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { step: '01', icon: '📝', title: 'Describe Crisis', desc: 'Type what\'s happening in your own words. No forms, no complexity.' },
            { step: '02', icon: '📍', title: 'Location Captured', desc: 'Browser auto-detects your GPS coordinates instantly and securely.' },
            { step: '03', icon: '🤖', title: 'AI Prioritizes', desc: 'Our model ranks urgency and matches the right type of help needed.' },
            { step: '04', icon: '🚀', title: 'Help Dispatched', desc: 'Nearest volunteers and NGOs are alerted and on their way to you.' },
          ].map(({ step, icon, title, desc }, i) => (
            <div key={step} style={{ textAlign: 'center', position: 'relative' }}>
              {i < 3 && <div style={{ position: 'absolute', top: 40, left: '65%', width: '60%', height: 2, background: 'linear-gradient(to right, #1a4d2e, transparent)', opacity: 0.3 }} />}
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f5f0e8', border: '3px solid #1a4d2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' }}>
                {icon}
              </div>
              <div style={{ display: 'inline-block', background: '#0f3320', color: '#f5c518', fontSize: 11, fontWeight: 800, padding: '3px 12px', borderRadius: 20, marginBottom: 12 }}>{step}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f3320', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BIG CTA BANNER ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f3320, #1a4d2e)', padding: '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,197,24,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-40%', right: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(245,197,24,0.08)' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Join Today And Help<br /><span style={{ color: '#f5c518' }}>Change Lives.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 40 }}>
            Whether you're in need or want to volunteer — ResQSync connects you to your community's emergency network instantly.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => goAs('user')} style={{ background: '#f5c518', color: '#0f3320', border: 'none', padding: '16px 40px', borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,197,24,0.3)' }}>
              🙋 I Need Help
            </button>
            <button onClick={() => goAs('ngo')} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '16px 40px', borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              🏥 Join as NGO Admin
            </button>
          </div>
        </div>
      </section>

      {/* ── CAUSES / CATEGORIES ── */}
      <section style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,77,46,0.1)', borderRadius: 50, padding: '6px 16px', marginBottom: 12 }}>
              <span style={{ color: '#1a4d2e', fontSize: 13, fontWeight: 600 }}>💛 Our Popular Causes</span>
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f3320' }}>Making A Difference Through<br />These Causes</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '🌊', title: 'Flood Relief', raised: '₹4,52,000', goal: '₹8,00,000', pct: 56, cat: 'DISASTER' },
            { icon: '🍱', title: 'Food Security', raised: '₹2,80,000', goal: '₹5,00,000', pct: 56, cat: 'NUTRITION' },
            { icon: '💧', title: 'Clean Water', raised: '₹1,90,000', goal: '₹4,00,000', pct: 47, cat: 'HEALTH' },
          ].map(({ icon, title, raised, goal, pct, cat }) => (
            <div key={title} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #ede8df', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ height: 160, background: 'linear-gradient(135deg, #1a4d2e, #2d6a4f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, position: 'relative' }}>
                {icon}
                <span style={{ position: 'absolute', top: 12, left: 12, background: '#f5c518', color: '#0f3320', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>{cat}</span>
              </div>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f3320', marginBottom: 12 }}>{title}</h3>
                <div style={{ background: '#f5f0e8', borderRadius: 50, height: 8, marginBottom: 12 }}>
                  <div style={{ width: `${pct}%`, height: 8, background: '#f5c518', borderRadius: 50 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#4a5568' }}>Raised: <strong style={{ color: '#0f3320' }}>{raised}</strong></span>
                  <span style={{ color: '#4a5568' }}>Goal: <strong style={{ color: '#0f3320' }}>{goal}</strong></span>
                </div>
                <button onClick={() => goAs('user')} style={{ width: '100%', marginTop: 20, background: '#1a4d2e', color: 'white', border: 'none', padding: '12px', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Help Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: '#f0ebe0', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,77,46,0.1)', borderRadius: 50, padding: '6px 16px', marginBottom: 16 }}>
              <span style={{ color: '#1a4d2e', fontSize: 13, fontWeight: 600 }}>⭐ Testimonials</span>
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f3320' }}>What People Say About<br />ResQSync</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { name: 'Priya Sharma', role: 'Flood Survivor, Chennai', quote: 'Within 8 minutes of reporting, 3 volunteers were at my door with food and a life jacket. ResQSync saved my family.' },
              { name: 'Mohammed Rafi', role: 'NGO Coordinator, Red Cross', quote: 'The AI prioritization is incredible. We now respond to 3x more emergencies with the same team size. Game changer.' },
              { name: 'Kavita Nair', role: 'Community Volunteer', quote: 'I get notified instantly when someone nearby needs help. It feels good to know I\'m making a real difference every day.' },
            ].map(({ name, role, quote }) => (
              <div key={name} style={{ background: 'white', borderRadius: 20, padding: 28, border: '1.5px solid #ede8df' }}>
                <div style={{ color: '#f5c518', fontSize: 24, marginBottom: 16 }}>★★★★★</div>
                <p style={{ color: '#4a5568', fontSize: 14, lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>"{quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1a4d2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5c518', fontWeight: 700, fontSize: 16 }}>{name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f3320', fontSize: 14 }}>{name}</p>
                    <p style={{ color: '#4a5568', fontSize: 12 }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0f3320', padding: '64px 48px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#0f3320' }}>R</div>
                <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>ResQSync</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>Smart AI-powered emergency coordination. Connecting volunteers with communities in crisis, every second of every day.</p>
            </div>
            {[
              { heading: 'Platform', links: ['Report Emergency', 'Volunteer Dashboard', 'NGO Admin', 'How It Works'] },
              { heading: 'About', links: ['Our Mission', 'Team', 'Partners', 'Contact'] },
              { heading: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Feedback'] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 14 }}>{heading}</p>
                {links.map(link => (
                  <p key={link} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 10, cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.color = '#f5c518'}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  >{link}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>© 2025 ResQSync. All rights reserved.</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Built for Social Impact 💛</p>
          </div>
        </div>
      </footer>

    </div>
  )
}