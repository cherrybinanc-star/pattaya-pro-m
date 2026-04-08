import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error('Fill all required fields');
    setLoading(true);
    try {
      await register({ name, email, phone, password });
      toast.success('Account created! 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Sign Up — PattayaPro</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, var(--cream), var(--gold-bg))' }}>
        <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 5%' }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', fontSize: 28, fontWeight: 800, marginBottom: 48 }}>
            <span style={{ color: 'var(--gold)' }}>Pattaya</span><span style={{ color: 'var(--pri-d)' }}>Pro</span>
            <span style={{ fontSize: 12, color: 'var(--gray)', marginLeft: 10 }}>← Back</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, lineHeight: 1.12, margin: '0 0 16px' }}>
            Join <span style={{ color: 'var(--pri)' }}>PattayaPro</span><br />Today
          </h1>
          <p style={{ color: 'var(--dark-m)', fontSize: 16, maxWidth: 400, lineHeight: 1.65 }}>
            Create your free account and book home services in minutes.
          </p>
        </div>

        <div style={{ flex: '1 1 420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 5%' }}>
          <div style={{ width: '100%', maxWidth: 440, background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 24px 64px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Create Account</h2>
            <p style={{ color: 'var(--gray)', fontSize: 13, margin: '0 0 24px' }}>It's free — book services in minutes</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name *</label>
                <div className="input-field">
                  <span>👤</span>
                  <input placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Email *</label>
                <div className="input-field">
                  <span>✉️</span>
                  <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Phone</label>
                <div className="input-field">
                  <span>📱</span>
                  <input placeholder="+66 xxx xxx xxxx" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>Password *</label>
                <div className="input-field">
                  <span>🔒</span>
                  <input type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-teal btn-full" style={{ marginTop: 4, padding: 14, fontSize: 15 }}>
                {loading ? 'Creating...' : 'Create My Account →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--gray)' }}>
              Already have an account?{' '}
              <span onClick={() => router.push('/login')} style={{ color: 'var(--pri)', fontWeight: 700, cursor: 'pointer' }}>Log In →</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
