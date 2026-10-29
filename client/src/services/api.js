import axios from 'axios';

// Dynamically normalize API Base URL:
// 1. If VITE_API_URL is configured (e.g., https://xyz.vercel.app or https://xyz.vercel.app/api/):
//    - Strips trailing slashes
//    - Guarantees clean '/api' suffix
// 2. If VITE_API_URL is undefined (local dev or unified proxy):
//    - Defaults to '/api'
const rawUrl = (import.meta.env.VITE_API_URL || '').trim();

export const API_BASE_URL = (() => {
  if (!rawUrl) return '/api';
  const clean = rawUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
})();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercept requests and attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lexiai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors & network diagnostics
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Helpful console diagnostic if request failed due to connection/CORS
    if (error.message === 'Network Error' || !error.response) {
      console.error(
        `[LexiAI Connection Error] Unable to connect to backend at: ${API_BASE_URL}. Verify backend deployment and CORS settings.`
      );
    }

    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login/register endpoints
      const isAuthEndpoint =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        localStorage.removeItem('lexiai_token');
        localStorage.removeItem('lexiai_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
