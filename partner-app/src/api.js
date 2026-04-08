const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("partner_token");
}

async function request(path, opts = {}) {
  const { method = "GET", body, auth = true } = opts;
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  const res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

const api = {
  register: async (d) => { const r = await request("/partner/register", { method: "POST", body: d, auth: false }); localStorage.setItem("partner_token", r.token); return r; },
  login: async (email, password) => { const r = await request("/partner/login", { method: "POST", body: { email, password }, auth: false }); localStorage.setItem("partner_token", r.token); return r; },
  getMe: () => request("/partner/me"),
  updateProfile: (d) => request("/partner/profile", { method: "PUT", body: d }),
  setOnline: (isOnline) => request("/partner/online", { method: "PUT", body: { isOnline } }),
  updateSchedule: (schedules) => request("/partner/schedule", { method: "PUT", body: { schedules } }),
  getEarnings: () => request("/partner/earnings"),
  getStats: () => request("/partner/stats"),
  getJobs: (s) => request(`/bookings/partner/jobs${s ? "?status=" + s : ""}`),
  getNewJobs: () => request("/bookings/partner/new"),
  acceptJob: (id) => request(`/bookings/partner/${id}/accept`, { method: "PUT" }),
  completeJob: (id) => request(`/bookings/partner/${id}/complete`, { method: "PUT" }),
  declineJob: (id) => request(`/bookings/partner/${id}/decline`, { method: "PUT" }),
  logout: () => localStorage.removeItem("partner_token"),
};

export default api;
