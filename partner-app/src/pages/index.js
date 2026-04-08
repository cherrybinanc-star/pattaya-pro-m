import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { usePartnerAuth } from "../contexts/AuthContext";

export default function PartnerLogin() {
  const { partner, login, loading: authLoading } = usePartnerAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (partner) router.push("/dashboard"); }, [partner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) return setError("Fill all fields");
    setError(""); setLoading(true);
    try { await login(email, pass); router.push("/dashboard"); }
    catch (err) { setError(err.message); }
    setLoading(false);
  };

  const CUST_URL = process.env.NEXT_PUBLIC_CUSTOMER_URL || "http://localhost:3000";

  return (
    <>
      <Head><title>Partner Login — PattayaPro</title></Head>
      <div style={{ minHeight: "100vh", fontFamily: "var(--font)", background: "linear-gradient(160deg, var(--dark), var(--dark-s), #0a3a3a)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 5%", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <span style={{ fontSize: 26, fontWeight: 800 }}>
            <span style={{ color: "var(--gold)" }}>Pattaya</span><span style={{ color: "white" }}>Pro</span>
          </span>
          <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, marginLeft: 10, background: "rgba(212,160,32,0.15)", padding: "3px 10px", borderRadius: 12 }}>🔧 Partner</span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 5%", flexWrap: "wrap", gap: 50 }}>
          <div style={{ flex: "1 1 360px", maxWidth: 460 }}>
            <h1 style={{ fontSize: "clamp(30px,4vw,48px)", fontWeight: 800, color: "white", lineHeight: 1.1, margin: "0 0 18px" }}>
              Welcome Back,<br /><span style={{ color: "var(--gold)" }}>Partner</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.65, maxWidth: 400 }}>
              Access your dashboard, manage jobs, and track your earnings.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 360, marginTop: 30 }}>
              {[
                { ic: "💰", v: "฿45K+", l: "Avg Monthly" },
                { ic: "📋", v: "500+", l: "Partners" },
                { ic: "⭐", v: "4.8", l: "Rating" },
                { ic: "🔔", v: "50+", l: "Daily Jobs" },
              ].map(s => (
                <div key={s.l} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.ic}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--gold)" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: "1 1 380px", maxWidth: 460 }}>
            <div style={{ background: "white", borderRadius: 28, padding: 36, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Partner Login 🔧</h2>
              <p style={{ color: "var(--gray)", fontSize: 13, margin: "0 0 22px" }}>Access your partner dashboard</p>

              {error && <div style={{ background: "rgba(220,53,69,0.08)", color: "var(--red)", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="input-group"><label>Email</label><div className="input-field"><span>✉️</span><input type="email" placeholder="partner@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
                <div className="input-group"><label>Password</label><div className="input-field"><span>🔒</span><input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} /></div></div>
                <button type="submit" className="btn btn-dark btn-full" style={{ marginTop: 4, padding: 14, fontSize: 15 }}>
                  {loading ? "Logging in..." : "Log In to Dashboard →"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
                New partner? <Link href="/register"><span style={{ color: "var(--pri)", fontWeight: 700, cursor: "pointer" }}>Register Now →</span></Link>
              </div>
              <div style={{ textAlign: "center", marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--gray-l)", fontSize: 13, color: "var(--gray)" }}>
                Need services? <a href={CUST_URL} style={{ color: "var(--pri)", fontWeight: 700 }}>👤 Customer App →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
