import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import Head from 'next/head';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ customers: '10K+', providers: '500+', services: '50+' });

  useEffect(() => {
    if (user) { router.push('/dashboard'); return; }
    api.getCategories().then(setCategories).catch(() => {});
    api.getStats().then(s => setStats({
      customers: s.customers > 1000 ? `${(s.customers/1000).toFixed(0)}K+` : `${s.customers}+`,
      providers: s.providers > 100 ? `${s.providers}+` : `${s.providers}+`,
      services: `${s.services}+`,
    })).catch(() => {});
  }, [user]);

  return (
    <>
      <Head>
        <title>PattayaPro — Home Services in Pattaya</title>
        <meta name="description" content="Book trusted home service professionals in Pattaya, Thailand" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
        {/* Navbar */}
        <nav style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 5%', maxWidth: 1200, margin: '0 auto',
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(255,252,244,0.92)', backdropFilter: 'blur(12px)',
        }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
            <span style={{ color: 'var(--gold)' }}>Pattaya</span>
            <span style={{ color: 'var(--pri-d)' }}>Pro</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 14, fontWeight: 500, color: 'var(--dark-m)' }}>
            <span style={{ cursor: 'pointer' }}>Services</span>
            <span style={{ cursor: 'pointer' }}>How It Works</span>
            <span style={{ cursor: 'pointer' }}>About</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={() => router.push('/login')} style={{ padding: '10px 20px', fontSize: 13 }}>
              👤 User Login
            </button>
            <button className="btn btn-dark" onClick={() => window.open(process.env.NEXT_PUBLIC_PARTNER_URL || 'http://localhost:3001', '_blank')} style={{ padding: '10px 20px', fontSize: 13 }}>
              🔧 Partner Login
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="container" style={{ padding: '60px 5% 40px', display: 'flex', alignItems: 'center', gap: 50, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 420px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(12,124,124,0.1)', color: 'var(--pri)', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 24, marginBottom: 18 }}>
              🌴 #1 Home Services Platform in Pattaya
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px,5vw,58px)', fontWeight: 800, lineHeight: 1.08, margin: '0 0 18px' }}>
              Expert Home<br />Services{' '}
              <span style={{ color: 'var(--pri)' }}>At Your</span><br />
              <span style={{ background: 'linear-gradient(135deg,var(--gold),var(--pri))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Doorstep</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--dark-m)', lineHeight: 1.65, margin: '0 0 32px', maxWidth: 460 }}>
              From AC repair to Thai massage — book trusted, verified professionals in Pattaya with just a few taps.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
              <div onClick={() => router.push('/register')} style={{
                flex: '1 1 200px', background: 'white', borderRadius: 22, padding: '22px 24px',
                cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '2px solid rgba(12,124,124,0.1)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>I Need a Service</div>
                <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 12 }}>Book cleaning, repair, beauty & more</div>
                <button className="btn btn-teal btn-full" style={{ padding: '12px 0', fontSize: 14 }}>Sign Up Free →</button>
              </div>
              <div onClick={() => window.open(process.env.NEXT_PUBLIC_PARTNER_URL, '_blank')} style={{
                flex: '1 1 200px', background: 'var(--dark)', borderRadius: 22, padding: '22px 24px',
                cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', color: 'white',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔧</div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>I'm a Provider</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Get leads, earn ฿45K+/month</div>
                <button className="btn btn-pri btn-full" style={{ padding: '12px 0', fontSize: 14 }}>Register as Partner →</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { n: stats.customers, l: 'Customers' },
                { n: stats.providers, l: 'Providers' },
                { n: stats.services, l: 'Services' },
                { n: '4.8★', l: 'Rating' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pri-d)' }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            flex: '1 1 340px', minHeight: 380, borderRadius: 28,
            background: 'linear-gradient(145deg, var(--pri-dd), var(--pri) 55%, var(--gold))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 20, right: 20, width: 140, height: 140, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
            <div style={{ textAlign: 'center', padding: 40, zIndex: 2 }}>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontSize: 44, marginBottom: 20 }}>🧹❄️💆💅🔧</div>
              <div style={{ color: 'white', fontSize: 24, fontWeight: 800, lineHeight: 1.3 }}>All Home Services<br />One Platform</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 10 }}>Pattaya · Jomtien · Naklua</div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container" style={{ padding: '40px 5% 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, margin: '0 0 8px' }}>Browse Services</h2>
            <p style={{ color: 'var(--gray)', fontSize: 15 }}>Everything your home needs</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 16 }}>
            {categories.map(c => (
              <div key={c.id} onClick={() => router.push('/register')} style={{
                background: 'white', borderRadius: 22, padding: 22, textAlign: 'center',
                cursor: 'pointer', boxShadow: '0 2px 14px rgba(0,0,0,0.04)', transition: 'transform 0.2s',
              }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{c.nameTh}</div>
                <div style={{ fontSize: 11, color: 'var(--pri)', fontWeight: 600, marginTop: 6 }}>{c.providerCount} providers</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ background: 'white', padding: '60px 5%' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, margin: '0 0 8px' }}>How It Works</h2>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { ic: '📱', t: '1. Create Account', d: 'Sign up as customer or partner in under a minute.' },
                { ic: '🔍', t: '2. Book a Service', d: 'Browse categories, pick service, choose date & time.' },
                { ic: '✨', t: '3. Get It Done', d: 'Verified pro arrives at your door. Pay after completion.' },
              ].map((s, i) => (
                <div key={i} style={{ flex: '1 1 260px', maxWidth: 350, background: 'var(--cream)', borderRadius: 22, padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>{s.ic}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{s.t}</h3>
                  <p style={{ fontSize: 14, color: 'var(--dark-m)', lineHeight: 1.65 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: 'var(--dark)', padding: '44px 5%', color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10 }}>
                <span style={{ color: 'var(--gold)' }}>Pattaya</span>Pro
              </div>
              <p style={{ maxWidth: 280, lineHeight: 1.6 }}>Your trusted platform for home services in Pattaya.</p>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              <div>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: 10 }}>Company</div>
                {['About', 'Careers', 'Blog'].map(l => <div key={l} style={{ marginBottom: 5, cursor: 'pointer' }}>{l}</div>)}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: 10 }}>Support</div>
                {['Help', 'Terms', 'Privacy'].map(l => <div key={l} style={{ marginBottom: 5, cursor: 'pointer' }}>{l}</div>)}
              </div>
            </div>
          </div>
          <div className="container" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            © 2026 PattayaPro. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
