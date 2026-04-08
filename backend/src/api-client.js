// api.js — Drop this into both frontend/src/ and partner-app/src/
// Handles all API calls to the PattayaPro backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  getToken(type = "user") {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(type === "partner" ? "partner_token" : "user_token");
  }

  setToken(token, type = "user") {
    localStorage.setItem(type === "partner" ? "partner_token" : "user_token", token);
  }

  removeToken(type = "user") {
    localStorage.removeItem(type === "partner" ? "partner_token" : "user_token");
  }

  async request(path, options = {}) {
    const { method = "GET", body, auth = true, tokenType = "user" } = options;

    const headers = { "Content-Type": "application/json" };
    if (auth) {
      const token = this.getToken(tokenType);
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${method} ${path}]:`, err.message);
      throw err;
    }
  }

  // ─── Customer Auth ────────────────────────────
  async register(data) {
    const res = await this.request("/auth/register", { method: "POST", body: data, auth: false });
    this.setToken(res.token, "user");
    return res;
  }

  async login(email, password) {
    const res = await this.request("/auth/login", { method: "POST", body: { email, password }, auth: false });
    this.setToken(res.token, "user");
    return res;
  }

  async getMe() {
    return this.request("/auth/me");
  }

  async updateProfile(data) {
    return this.request("/auth/profile", { method: "PUT", body: data });
  }

  async addAddress(data) {
    return this.request("/auth/address", { method: "POST", body: data });
  }

  // ─── Partner Auth ─────────────────────────────
  async partnerRegister(data) {
    const res = await this.request("/partner/register", { method: "POST", body: data, auth: false });
    this.setToken(res.token, "partner");
    return res;
  }

  async partnerLogin(email, password) {
    const res = await this.request("/partner/login", { method: "POST", body: { email, password }, auth: false });
    this.setToken(res.token, "partner");
    return res;
  }

  async getPartnerMe() {
    return this.request("/partner/me", { tokenType: "partner" });
  }

  async updatePartnerProfile(data) {
    return this.request("/partner/profile", { method: "PUT", body: data, tokenType: "partner" });
  }

  async setOnline(isOnline) {
    return this.request("/partner/online", { method: "PUT", body: { isOnline }, tokenType: "partner" });
  }

  async updateSchedule(schedules) {
    return this.request("/partner/schedule", { method: "PUT", body: { schedules }, tokenType: "partner" });
  }

  async getPartnerEarnings() {
    return this.request("/partner/earnings", { tokenType: "partner" });
  }

  async getPartnerStats() {
    return this.request("/partner/stats", { tokenType: "partner" });
  }

  // ─── Services ─────────────────────────────────
  async getCategories() {
    return this.request("/services/categories", { auth: false });
  }

  async getCategoryServices(categoryId) {
    return this.request(`/services/category/${categoryId}`, { auth: false });
  }

  async getPopularServices() {
    return this.request("/services/popular", { auth: false });
  }

  async searchServices(query) {
    return this.request(`/services/search?q=${encodeURIComponent(query)}`, { auth: false });
  }

  async getService(id) {
    return this.request(`/services/${id}`, { auth: false });
  }

  async getProviders(categoryId) {
    return this.request(`/services/providers/${categoryId}`, { auth: false });
  }

  // ─── Bookings (Customer) ──────────────────────
  async createBooking(data) {
    return this.request("/bookings", { method: "POST", body: data });
  }

  async getBookings(status) {
    const q = status ? `?status=${status}` : "";
    return this.request(`/bookings${q}`);
  }

  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  }

  async cancelBooking(id, reason) {
    return this.request(`/bookings/${id}/cancel`, { method: "PUT", body: { reason } });
  }

  async reviewBooking(id, rating, comment) {
    return this.request(`/bookings/${id}/review`, { method: "POST", body: { rating, comment } });
  }

  // ─── Bookings (Partner) ───────────────────────
  async getPartnerJobs(status) {
    const q = status ? `?status=${status}` : "";
    return this.request(`/bookings/partner/jobs${q}`, { tokenType: "partner" });
  }

  async getNewJobs() {
    return this.request("/bookings/partner/new", { tokenType: "partner" });
  }

  async acceptJob(id) {
    return this.request(`/bookings/partner/${id}/accept`, { method: "PUT", tokenType: "partner" });
  }

  async startJob(id) {
    return this.request(`/bookings/partner/${id}/start`, { method: "PUT", tokenType: "partner" });
  }

  async completeJob(id) {
    return this.request(`/bookings/partner/${id}/complete`, { method: "PUT", tokenType: "partner" });
  }

  async declineJob(id) {
    return this.request(`/bookings/partner/${id}/decline`, { method: "PUT", tokenType: "partner" });
  }

  // ─── Public ───────────────────────────────────
  async getPublicStats() {
    return this.request("/stats", { auth: false });
  }

  async healthCheck() {
    return this.request("/health", { auth: false });
  }

  // ─── Logout ───────────────────────────────────
  logout(type = "user") {
    this.removeToken(type);
  }
}

const api = new ApiClient();
export default api;
