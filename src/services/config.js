const normalizeBaseUrl = (url) => url.replace(/\/$/, '');

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
);

export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
export const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;
