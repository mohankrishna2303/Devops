/**
 * Auth service: login, register, profile, token storage (localStorage).
 * Uses backend: POST /api/auth/login/, POST /api/auth/register/, GET /api/auth/profile/
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const TOKEN_KEY = 'devops_access_token';
const REFRESH_KEY = 'devops_refresh_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = (access, refresh) => {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || 'Login failed');
  setTokens(data.access, data.refresh);
  return data;
};

export const register = async (username, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.username?.[0] || data.email?.[0] || data.detail || 'Registration failed');
  }
  return res.json();
};

export const getProfile = async () => {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/auth/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
};

export const isAuthenticated = () => !!getToken();
