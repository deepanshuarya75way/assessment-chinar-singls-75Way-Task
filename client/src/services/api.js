// Centralized API client for 75 Way Project Task
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Get token from localStorage
const getToken = () => localStorage.getItem('tc_token');

// Core request function
const request = async (method, path, data = null, isPublic = false) => {
  const headers = {};
  if (!isPublic) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = data instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = { method: method.toUpperCase(), headers };
  if (data) config.body = isFormData ? data : JSON.stringify(data);

  const res = await fetch(`${BASE_URL}${path}`, config);
  const json = await res.json();

  if (!res.ok) {
    if (res.status === 401 && path !== '/auth/login' && !isPublic) {
      // Auto-logout on expired token for protected routes
      localStorage.removeItem('tc_token');
      localStorage.removeItem('tc_user');
      window.location.href = '/login';
    }
    const error = new Error(json.message || 'Something went wrong');
    error.code = json.code;
    throw error;
  }
  return json;
};

// Fetch a protected file (e.g. teacher application documents) as a Blob using
// the SAME JWT mechanism as request() — browser <img>/<object> tags cannot
// attach an Authorization header, so callers turn the Blob into an object URL.
export const requestBlob = async (path) => {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { method: 'GET', headers });

  if (!res.ok) {
    let message = 'Unable to load this document.';
    try { const json = await res.json(); message = json.message || message; } catch { /* non-JSON error body */ }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return res.blob();
};

// ── AUTH ──────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => request('POST', '/auth/login', data, true),
  register: (data) => request('POST', '/auth/register', data, true),
  verifyOtp: (data) => request('POST', '/auth/verify-otp', data, true),
  resendOtp: (data) => request('POST', '/auth/resend-otp', data, true),
  logout: () => request('POST', '/auth/logout'),
  getMe: () => request('GET', '/auth/me'),
  forgotPassword: (email) => request('POST', '/auth/forgot-password', { email }, true),
  updatePassword: (currentPassword, newPassword) => request('PATCH', '/auth/update-password', { currentPassword, newPassword }),
  updateProfile: (data) => request('PATCH', '/auth/update-profile', data),
};

// ── REQUESTS (Student Tuition) ────────────────────────────────
export const requestsAPI = {
  create: (data) => request('POST', '/requests', data),
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/requests${qs ? '?' + qs : ''}`);
  },
  getOne: (id) => request('GET', `/requests/${id}`),
  updateStatus: (id, data) => request('PATCH', `/requests/${id}/status`, data),
  assign: (id, teacherId) => request('PATCH', `/requests/${id}/assign`, { teacherId }),
  getStats: () => request('GET', '/requests/stats'),
  getPublicStats: () => request('GET', '/requests/public-stats', null, true),
  getMyAssignments: () => request('GET', '/requests/my-assignments'),
  getMyRequests: () => request('GET', '/requests/my'),
};


// ── TEACHERS ─────────────────────────────────────────────────
export const teachersAPI = {
  apply: (data) => request('POST', '/teachers/apply', data, true),
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/teachers${qs ? '?' + qs : ''}`);
  },
  fetchAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/teachers/fetch${qs ? '?' + qs : ''}`);
  },
  getOne: (id) => request('GET', `/teachers/${id}`),
  approve: (id) => request('PATCH', `/teachers/${id}/approve`),
  reject: (id, reason) => request('PATCH', `/teachers/${id}/reject`, { reason }),
  getStats: () => request('GET', '/teachers/stats'),
  getMyProfile: () => request('GET', '/teachers/me/profile'),
  updateMyProfile: (data) => request('PATCH', '/teachers/me/profile', data),
  getApplications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/teachers/applications${qs ? '?' + qs : ''}`);
  },
  getApplicationById: (id) => request('GET', `/teachers/applications/${id}`),
};

// ── DEMOS ────────────────────────────────────────────────────
export const demosAPI = {
  schedule: (data) => request('POST', '/demos', data),
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/demos${qs ? '?' + qs : ''}`);
  },
  getMyDemos: () => request('GET', '/demos/my'),
  complete: (id) => request('PATCH', `/demos/${id}/complete`),
  cancel: (id, reason) => request('PATCH', `/demos/${id}/cancel`, { reason }),
};

// ── ADMIN ────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => request('GET', '/admin/dashboard'),
  getUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/admin/users${qs ? '?' + qs : ''}`);
  },
  toggleUser: (id) => request('PATCH', `/admin/users/${id}/toggle`),
};

// ── NOTIFICATIONS ────────────────────────────────────────────
export const notificationsAPI = {
  getMyNotifications: () => request('GET', '/notifications'),
  markAsRead: (id) => request('PATCH', `/notifications/${id}/read`),
  markAllAsRead: () => request('PATCH', '/notifications/read-all'),
};

// ── Health check ──────────────────────────────────────────────
export const healthCheck = () => fetch(`${BASE_URL}/health`).then(r => r.json());
