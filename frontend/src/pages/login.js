import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Login — PattayaPro</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, var(--cream), var(--gold-bg))' }}>
        {/* Left */}
        <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 5%' }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', fontSize: 28, fontWeight: 800, marginBottom: 48 }}>
            <span style={{ color: 'var(--gold)' }}>Pattaya</span><span style={{ color: 'var(--pri-d)' }}>Pro</span>
            <span style={{ fontSize: 12, color: 'var(--gray)', marginLeft: 10 }}>← Back</span>
          </div>
          <div style={{ background: 'rgba(12,124,124,0.1)', color: 'var(--pri)', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20, width: 'fit-content', marginBottom: 16 }}>
            👤 Customer Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, lineHeight: 1.12, margin: '0 0 16px' }}>
            Book Home<br />Services in<br /><span style={{ color: 'var(--pri)' }}>Pattaya</span>
          </h1>
          <p style={{ color: 'var(--dark-m)', fontSize: 16, maxWidth: 400, lineHeight: 1.65 }}>
            Trusted professionals for cleaning, AC, massage, beauty & more.
          </p>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--gray)' }}>
            Test: cherry@test.com / password123
          </div>
        </div>

        {/* Right - Form */}
        <div style={{ flex: '1 1 420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 5%' }}>
          <div style={{ width: '100%', maxWidth: 440, background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 24px 64px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Welcome Back 👋</h2>
            <p style={{ color: 'var(--gray)', fontSize: 13, margin: '0 0 24px' }}>Log in to book services</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-field">
                  <span>✉️</span>
                  <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Password</label>
                <div className="input-field">
                  <span>🔒</span>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-teal btn-full" style={{ marginTop: 4, padding: 14, fontSize: 15 }}>
                {loading ? 'Logging in...' : 'Log In →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <span style={{ color: 'var(--gray)', fontSize: 13 }}>
                No account?{' '}
                <span onClick={() => router.push('/register')} style={{ color: 'var(--pri)', fontWeight: 700, cursor: 'pointer' }}>Sign Up →</span>
              </span>
            </div>
            <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--gray-l)', fontSize: 13, color: 'var(--gray)' }}>
              Are you a provider?{' '}
              <span onClick={() => window.open(process.env.NEXT_PUBLIC_PARTNER_URL, '_blank')} style={{ color: 'var(--dark)', fontWeight: 700, cursor: 'pointer' }}>🔧 Partner Login →</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
