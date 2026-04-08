const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(path, opts = {}) {
  const { method = 'GET', body, auth = true } = opts;
  const headers = { 'Content-Type': 'application/json' };

  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: data, auth: false }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: data }),
  addAddress: (data) => request('/auth/address', { method: 'POST', body: data }),

  // Services
  getCategories: () => request('/services/categories', { auth: false }),
  getCategoryServices: (id) => request(`/services/category/${id}`, { auth: false }),
  getPopular: () => request('/services/popular', { auth: false }),
  search: (q) => request(`/services/search?q=${encodeURIComponent(q)}`, { auth: false }),
  getService: (id) => request(`/services/${id}`, { auth: false }),

  // Bookings
  createBooking: (data) => request('/bookings', { method: 'POST', body: data }),
  getBookings: (status) => request(`/bookings${status ? `?status=${status}` : ''}`),
  getBooking: (id) => request(`/bookings/${id}`),
  cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'PUT', body: { reason } }),
  reviewBooking: (id, rating, comment) => request(`/bookings/${id}/review`, { method: 'POST', body: { rating, comment } }),

  // Public
  getStats: () => request('/stats', { auth: false }),
};

export default api;
