import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { usePartnerAuth } from "../contexts/AuthContext";
import api from "../api";

export default function PartnerDashboard() {
  const { partner, loading: authLoading, logout, setPartner } = usePartnerAuth();
  const router = useRouter();
  const [tab, setTab] = useState("home");
  const [online, setOnline] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [newJobs, setNewJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [earnings, setEarnings] = useState({ earnings: [], totals: [] });
  const [toast, setToast] = useState("");

  useEffect(() => { if (!authLoading && !partner) router.push("/"); }, [partner, authLoading]);

  useEffect(() => {
    if (partner) {
      setOnline(partner.isOnline || false);
      loadData();
    }
  }, [partner]);

  const loadData = async () => {
    try {
      const [j, nj, s, e] = await Promise.all([
        api.getJobs(), api.getNewJobs(), api.getStats(), api.getEarnings(),
      ]);
      setJobs(j); setNewJobs(nj); setStats(s); setEarnings(e);
    } catch (err) { console.error("Load error:", err); }
  };

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const toggleOnline = async () => {
    try {
      const res = await api.setOnline(!online);
      setOnline(res.isOnline);
      showToast(res.isOnline ? "You're online! 🟢" : "You're offline");
    } catch (err) { showToast("Failed to update status"); }
  };

  const handleAccept = async (id) => {
    try { await api.acceptJob(id); showToast("Job accepted! ✅"); loadData(); }
    catch (err) { showToast("Accept failed"); }
  };

  const handleComplete = async (id) => {
    try { await api.completeJob(id); showToast("Job completed! 💰"); loadData(); }
    catch (err) { showToast("Complete failed"); }
  };

  const handleDecline = async (id) => {
    try { await api.declineJob(id); showToast("Job declined"); loadData(); }
    catch (err) { showToast("Decline failed"); }
  };

  if (authLoading || !partner) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "var(--font)" }}>Loading...</div>;

  const confirmed = jobs.filter(j => j.status === "confirmed" || j.status === "in_progress");
  const completed = jobs.filter(j => j.status === "completed");
  const catNames = partner.categories?.map(c => c.category?.name).join(", ") || "Service Provider";

  // ─── JOBS TAB ───
  const JobsTab = () => (
    <div style={{ padding: "0 18px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "4px 0 16px" }}>
        {[
          { l: "Today", v: `฿${(stats.today || 0).toLocaleString()}`, c: "var(--green)", ic: "💰" },
          { l: "This Week", v: `฿${(stats.week || 0).toLocaleString()}`, c: "var(--pri)", ic: "📊" },
          { l: "Total Jobs", v: stats.totalJobs || 0, c: "var(--blue)", ic: "📋" },
          { l: "Rating", v: `⭐ ${stats.rating || 0}`, c: "var(--gold)", ic: "🏆" },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--gray)" }}>{s.l}</span>
              <span style={{ fontSize: 16 }}>{s.ic}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.c, marginTop: 4 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {!online && (
        <div className="card" style={{ background: "rgba(243,156,18,0.1)", borderLeft: "4px solid var(--gold)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>You are offline</div>
              <div style={{ fontSize: 12, color: "var(--gray)" }}>Go online to receive jobs</div>
            </div>
            <button onClick={toggleOnline} className="btn" style={{ padding: "8px 16px", fontSize: 12, background: "var(--green)", color: "white" }}>Go Online</button>
          </div>
        </div>
      )}

      {newJobs.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>🔔 New Requests</h3>
            <span className="badge badge-red">{newJobs.length} pending</span>
          </div>
          {newJobs.map(j => (
            <div key={j.id} className="card" style={{ borderLeft: "4px solid var(--gold)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{j.service?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--gray)" }}>👤 {j.user?.name}</div>
                </div>
                <span className="badge badge-gold">NEW</span>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--dark-m)", marginBottom: 10, flexWrap: "wrap" }}>
                <span>📍 {j.address}</span>
                <span>📅 {new Date(j.date).toLocaleDateString()}</span>
                <span>🕐 {j.timeSlot}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--pri-d)" }}>฿{j.price}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleDecline(j.id)} className="btn btn-danger" style={{ padding: "10px 16px", fontSize: 13 }}>✕</button>
                  <button onClick={() => handleAccept(j.id)} className="btn" style={{ padding: "10px 22px", fontSize: 13, background: "var(--green)", color: "white" }}>✓ Accept</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {confirmed.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "20px 0 10px" }}>🔧 Active ({confirmed.length})</h3>
          {confirmed.map(j => (
            <div key={j.id} className="card" style={{ borderLeft: "4px solid var(--pri)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{j.service?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--gray)" }}>👤 {j.user?.name} · 📍 {j.address}</div>
                </div>
                <span className="badge badge-teal">Active</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--pri-d)" }}>฿{j.price}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: "9px 14px", fontSize: 12 }}>📱 Call</button>
                  <button onClick={() => handleComplete(j.id)} className="btn btn-pri" style={{ padding: "9px 18px", fontSize: 12 }}>✓ Done</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {completed.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "20px 0 10px" }}>✅ Completed ({completed.length})</h3>
          {completed.slice(0, 5).map(j => (
            <div key={j.id} className="card" style={{ opacity: 0.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{j.service?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--gray)" }}>{j.user?.name} · {new Date(j.date).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 800, color: "var(--green)", fontSize: 15 }}>+฿{j.price}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {newJobs.length === 0 && confirmed.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>All caught up!</div>
          <div style={{ fontSize: 13, color: "var(--gray)", marginTop: 4 }}>New requests will appear here.</div>
        </div>
      )}
    </div>
  );

  // ─── EARNINGS TAB ───
  const EarningsTab = () => {
    const recentEarnings = earnings.earnings?.slice(0, 10) || [];
    return (
      <div style={{ padding: "0 18px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: "6px 0 14px" }}>💰 Earnings</h2>
        <div className="card" style={{ background: "linear-gradient(135deg, var(--dark), #0a3a3a)", padding: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Total Earnings</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 4 }}>฿{(stats.totalEarnings || 0).toLocaleString()}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>This Week</div><div style={{ fontWeight: 800, color: "var(--green)" }}>฿{(stats.week || 0).toLocaleString()}</div></div>
            <div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>This Month</div><div style={{ fontWeight: 800, color: "var(--gold)" }}>฿{(stats.month || 0).toLocaleString()}</div></div>
          </div>
          <button onClick={() => showToast("Withdrawal initiated!")} className="btn btn-pri btn-full" style={{ marginTop: 16, padding: 12 }}>Withdraw to Bank →</button>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "16px 0 10px" }}>Recent Transactions</h3>
        {recentEarnings.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 30, color: "var(--gray)" }}>No earnings yet</div>
        ) : recentEarnings.map(e => (
          <div key={e.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{e.type === "job" ? "Job Payment" : e.type === "bonus" ? "Bonus" : "Withdrawal"}</div>
                <div style={{ fontSize: 11, color: "var(--gray)" }}>{new Date(e.date).toLocaleDateString()} {e.note && `· ${e.note}`}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: e.type === "withdrawal" ? "var(--red)" : "var(--green)" }}>
                {e.type === "withdrawal" ? "-" : "+"}฿{e.amount.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ─── SCHEDULE TAB ───
  const ScheduleTab = () => {
    const [days, setDays] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      const sched = {};
      const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      defaultDays.forEach(d => { sched[d] = { on: false, f: "09:00", t: "18:00" }; });
      if (partner.schedules) {
        partner.schedules.forEach(s => {
          sched[s.day] = { on: s.isActive, f: s.startTime || "09:00", t: s.endTime || "18:00" };
        });
      }
      setDays(sched);
    }, [partner]);

    const saveSchedule = async () => {
      setSaving(true);
      try {
        const schedules = Object.entries(days).map(([day, v]) => ({
          day, isActive: v.on, startTime: v.on ? v.f : null, endTime: v.on ? v.t : null,
        }));
        await api.updateSchedule(schedules);
        showToast("Schedule saved! ✅");
      } catch (err) { showToast("Save failed"); }
      setSaving(false);
    };

    return (
      <div style={{ padding: "0 18px 20px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: "6px 0 14px" }}>📅 Schedule</h2>
        <div className="card" style={{ background: "rgba(12,138,138,0.08)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <span style={{ fontSize: 12, color: "var(--dark-m)", lineHeight: 1.5 }}>Set your hours — you only receive jobs when available.</span>
          </div>
        </div>
        {Object.entries(days).map(([day, v]) => (
          <div key={day} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div onClick={() => setDays({ ...days, [day]: { ...v, on: !v.on } })} style={{
                width: 44, height: 24, borderRadius: 12, cursor: "pointer", flexShrink: 0,
                background: v.on ? "var(--pri)" : "var(--gray-l)", position: "relative",
              }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: v.on ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, width: 36 }}>{day}</div>
              {v.on ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <input type="time" value={v.f} onChange={e => setDays({ ...days, [day]: { ...v, f: e.target.value } })} style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid var(--gray-l)", fontSize: 13, fontFamily: "var(--font)", background: "var(--gray-xl)" }} />
                  <span style={{ color: "var(--gray)", fontSize: 12 }}>to</span>
                  <input type="time" value={v.t} onChange={e => setDays({ ...days, [day]: { ...v, t: e.target.value } })} style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid var(--gray-l)", fontSize: 13, fontFamily: "var(--font)", background: "var(--gray-xl)" }} />
                </div>
              ) : <span style={{ fontSize: 13, color: "var(--gray)", fontStyle: "italic" }}>Day off</span>}
            </div>
          </div>
        ))}
        <div className="card">
          <h4 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700 }}>📍 Service Areas</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(partner.serviceAreas || []).map(a => (
              <span key={a.id} style={{ background: "rgba(12,138,138,0.1)", color: "var(--pri)", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 10 }}>{a.area}</span>
            ))}
          </div>
        </div>
        <button onClick={saveSchedule} className="btn btn-teal btn-full">{saving ? "Saving..." : "Save Schedule"}</button>
      </div>
    );
  };

  // ─── PROFILE TAB ───
  const ProfileTab = () => (
    <div style={{ padding: "0 18px 20px" }}>
      <div style={{ textAlign: "center", padding: "18px 0" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--dark), var(--pri-d))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 32, color: "white", fontWeight: 800 }}>{partner.name?.[0]}</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 2px" }}>{partner.name}</h2>
        <p style={{ color: "var(--gray)", fontSize: 12, margin: "0 0 8px" }}>{partner.email}</p>
        <div style={{ display: "inline-flex", gap: 8 }}>
          <span className="badge badge-teal">{catNames}</span>
          {partner.isVerified && <span className="badge badge-green">Verified ✓</span>}
        </div>
      </div>
      <div className="card" style={{ background: "rgba(12,138,138,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          {[
            { l: "Rating", v: `⭐ ${partner.rating}` },
            { l: "Jobs", v: partner.totalJobs },
            { l: "Earned", v: `฿${(partner.totalEarnings || 0).toLocaleString()}` },
          ].map(s => (
            <div key={s.l}><div style={{ fontWeight: 800, fontSize: 15, color: "var(--pri-d)" }}>{s.v}</div><div style={{ fontSize: 10, color: "var(--gray)" }}>{s.l}</div></div>
          ))}
        </div>
      </div>
      {[
        { i: "📋", l: "My Services", v: catNames },
        { i: "🏦", l: "Bank Account", v: partner.bankName || "Add bank" },
        { i: "📄", l: "Documents", v: partner.isVerified ? "Verified ✓" : "Pending" },
        { i: "📞", l: "Support", v: "24/7" },
        { i: "⚙️", l: "Settings", v: "" },
      ].map(x => (
        <div key={x.l} className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>{x.i}</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{x.l}</span>
            <span style={{ fontSize: 12, color: "var(--gray)" }}>{x.v}</span>
            <span style={{ color: "var(--gray)" }}>›</span>
          </div>
        </div>
      ))}
      <button onClick={logout} className="btn btn-danger btn-full" style={{ marginTop: 10 }}>Log Out</button>
    </div>
  );

  const renderTab = () => {
    if (tab === "earnings") return <EarningsTab />;
    if (tab === "schedule") return <ScheduleTab />;
    if (tab === "profile") return <ProfileTab />;
    return <JobsTab />;
  };

  return (
    <>
      <Head><title>Partner Dashboard — PattayaPro</title></Head>
      <div className="app-shell">
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, var(--dark), var(--dark-s))", padding: "14px 18px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>
                <span style={{ color: "var(--gold)" }}>Pattaya</span>Pro
                <span style={{ fontSize: 10, color: "var(--gray)", background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 8, marginLeft: 8 }}>PARTNER</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>👋 {partner.name}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div onClick={toggleOnline} style={{
                padding: "6px 14px", borderRadius: 24, fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: online ? "rgba(26,174,92,0.15)" : "rgba(220,53,69,0.15)",
                color: online ? "var(--green)" : "var(--red)",
              }}>
                {online ? "● Online" : "○ Offline"}
              </div>
              <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, position: "relative" }}>
                🔔
                {newJobs.length > 0 && <div style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, background: "var(--red)", borderRadius: "50%", fontSize: 9, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{newJobs.length}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="app-body">{renderTab()}</div>

        {/* Tab Bar */}
        <div className="app-tabs">
          {[
            { id: "home", ic: "📊", lb: "Jobs", bg: newJobs.length },
            { id: "earnings", ic: "💰", lb: "Earnings" },
            { id: "schedule", ic: "📅", lb: "Schedule" },
            { id: "profile", ic: "👤", lb: "Profile" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 14px", position: "relative" }}>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: 21 }}>{t.ic}</span>
                {(t.bg || 0) > 0 && <div style={{ position: "absolute", top: -4, right: -8, width: 16, height: 16, background: "var(--red)", borderRadius: "50%", fontSize: 9, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{t.bg}</div>}
              </div>
              <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "var(--pri)" : "var(--gray)" }}>{t.lb}</span>
              {tab === t.id && <div style={{ position: "absolute", top: -1, width: 20, height: 3, background: "var(--pri)", borderRadius: 2 }} />}
            </button>
          ))}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
