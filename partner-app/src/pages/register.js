import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { usePartnerAuth } from "../contexts/AuthContext";

const CATS = [
  "Cleaning", "AC Service", "Plumbing", "Electrical", "Beauty",
  "Massage", "Laundry", "Pest Control", "Pool Service", "Gardening", "Painting", "Moving",
];

export default function PartnerRegister() {
  const { register } = usePartnerAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const CUST_URL = process.env.NEXT_PUBLIC_CUSTOMER_URL || "http://localhost:3000";

  const nextStep = () => {
    if (!name || !email || !pass) return setError("Fill all required fields");
    setError(""); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register({ name, email, password: pass, phone, category, experience });
      router.push("/dashboard");
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <>
      <Head><title>Partner Registration — PattayaPro</title></Head>
      <div style={{ minHeight: "100vh", fontFamily: "var(--font)", background: "linear-gradient(160deg, var(--dark), var(--dark-s), #0a3a3a)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 5%", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <Link href="/"><span style={{ fontSize: 26, fontWeight: 800, cursor: "pointer" }}>
            <span style={{ color: "var(--gold)" }}>Pattaya</span><span style={{ color: "white" }}>Pro</span>
          </span></Link>
          <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, marginLeft: 10, background: "rgba(212,160,32,0.15)", padding: "3px 10px", borderRadius: 12 }}>🔧 Partner Registration</span>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 5%", flexWrap: "wrap", gap: 50 }}>
          <div style={{ flex: "1 1 360px", maxWidth: 460 }}>
            <h1 style={{ fontSize: "clamp(30px,4vw,48px)", fontWeight: 800, color: "white", lineHeight: 1.1, margin: "0 0 18px" }}>
              Join<br /><span style={{ color: "var(--gold)" }}>PattayaPro</span><br />as a Partner
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.65, maxWidth: 400 }}>
              Start earning ฿45K+/month. Free leads, flexible schedule, weekly payouts.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
              {["✓ Free to join", "✓ Flexible hours", "✓ Weekly payouts", "✓ Growth tools"].map(f => (
                <div key={f} style={{ color: "var(--gold-l)", fontSize: 13, fontWeight: 600 }}>{f}</div>
              ))}
            </div>
          </div>

          <div style={{ flex: "1 1 380px", maxWidth: 460 }}>
            <div style={{ background: "white", borderRadius: 28, padding: 36, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
              {/* Progress bar */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--pri)" }} />
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: step >= 2 ? "var(--pri)" : "var(--gray-l)" }} />
              </div>

              {error && <div style={{ background: "rgba(220,53,69,0.08)", color: "var(--red)", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

              {step === 1 ? (
                <>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Step 1: Account</h2>
                  <p style={{ color: "var(--gray)", fontSize: 13, margin: "0 0 20px" }}>Create your partner account</p>
                  <div className="input-group"><label>Full Name *</label><div className="input-field"><span>👤</span><input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></div></div>
                  <div className="input-group"><label>Email *</label><div className="input-field"><span>✉️</span><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
                  <div className="input-group"><label>Phone</label><div className="input-field"><span>📱</span><input placeholder="+66 xxx xxxx" value={phone} onChange={e => setPhone(e.target.value)} /></div></div>
                  <div className="input-group"><label>Password *</label><div className="input-field"><span>🔒</span><input type="password" placeholder="Create password" value={pass} onChange={e => setPass(e.target.value)} /></div></div>
                  <button onClick={nextStep} className="btn btn-dark btn-full" style={{ padding: 14, fontSize: 15 }}>Next: Professional Details →</button>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Step 2: Professional</h2>
                  <p style={{ color: "var(--gray)", fontSize: 13, margin: "0 0 20px" }}>Tell us about your services</p>
                  <div className="input-group">
                    <label>Service Category</label>
                    <div className="input-field">
                      <select value={category} onChange={e => setCategory(e.target.value)} style={{ border: "none", flex: 1, fontSize: 14, fontFamily: "var(--font)", background: "transparent" }}>
                        <option value="">Select your service</option>
                        {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="input-group"><label>Years of Experience</label><div className="input-field"><span>📅</span><input placeholder="e.g. 5" value={experience} onChange={e => setExperience(e.target.value)} /></div></div>
                  <div style={{ background: "rgba(12,138,138,0.08)", borderRadius: 14, padding: 14, marginBottom: 16, fontSize: 12, color: "var(--dark-m)", lineHeight: 1.6 }}>
                    📄 After registration, upload: ID copy, certificates, and profile photo. Verification takes 24-48 hours.
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={() => setStep(1)} className="btn btn-ghost" style={{ padding: "13px 20px" }}>← Back</button>
                    <button type="submit" className="btn btn-dark btn-full" style={{ padding: 14, fontSize: 15 }}>
                      {loading ? "Creating..." : "Create Account ✓"}
                    </button>
                  </div>
                </form>
              )}

              <div style={{ textAlign: "center", marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--gray-l)", fontSize: 13, color: "var(--gray)" }}>
                Already registered? <Link href="/"><span style={{ color: "var(--pri)", fontWeight: 700, cursor: "pointer" }}>Log In →</span></Link>
                <br /><br />
                Need services? <a href={CUST_URL} style={{ color: "var(--pri)", fontWeight: 700 }}>👤 Customer App →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
