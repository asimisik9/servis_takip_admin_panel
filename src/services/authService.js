import axios from 'axios';
import { AUTH_API_URL } from './config';

const STORAGE_KEYS = {
  token: 'token',
  refreshToken: 'refresh_token',
  user: 'user',
};

const safeStorage = {
  getItem(key) {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(key, value);
  },
  removeItem(key) {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(key);
  }
};

const decodeJwtPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds >= payload.exp;
};

const setSession = ({ access_token, refresh_token, user }) => {
  if (access_token) safeStorage.setItem(STORAGE_KEYS.token, access_token);
  if (refresh_token) safeStorage.setItem(STORAGE_KEYS.refreshToken, refresh_token);
  if (user) safeStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

const clearSession = () => {
  safeStorage.removeItem(STORAGE_KEYS.token);
  safeStorage.removeItem(STORAGE_KEYS.refreshToken);
  safeStorage.removeItem(STORAGE_KEYS.user);
};

const getStoredToken = () => {
  const token = safeStorage.getItem(STORAGE_KEYS.token);
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
};

export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${AUTH_API_URL}/login`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  if (!response.data) {
    throw new Error('Sunucudan boş yanıt döndü.');
  }

  const { access_token, refresh_token, user } = response.data;
  
  if (!access_token || !refresh_token) {
    throw new Error('Token bilgileri alınamadı.');
  }

  setSession({ access_token, refresh_token, user });
  return { access_token, refresh_token, user };
};

export const logout = async () => {
  const token = getStoredToken();
  if (token) {
    try {
      // Backend'e logout request gönder
      await axios.post(`${AUTH_API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  clearSession();
};

export const getToken = () => {
  const token = getStoredToken();
  if (!token || isTokenExpired(token)) return null;
  return token;
};

export const getRefreshToken = () => {
  const token = safeStorage.getItem(STORAGE_KEYS.refreshToken);
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
};

export const getUser = () => {
  const user = safeStorage.getItem(STORAGE_KEYS.user);
  if (!user || user === 'undefined' || user === 'null') return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};

export const buildAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('Refresh token bulunamadı.');
  }

  const response = await axios.post(
    `${AUTH_API_URL}/refresh`,
    { refresh_token: refreshToken },
    { skipAuthRefresh: true }
  );

  const { access_token, refresh_token, user } = response.data || {};
  if (!access_token) {
    throw new Error('Refresh sonrası access token alınamadı.');
  }

  setSession({
    access_token,
    refresh_token: refresh_token || refreshToken,
    user: user || getUser(),
  });
  return access_token;
};

export const isAuthenticated = () => Boolean(getToken() || getRefreshToken());

let interceptorsInitialized = false;
let isRefreshing = false;
let refreshQueue = [];

const resolveRefreshQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
};

export const initializeAuthInterceptors = () => {
  if (interceptorsInitialized) return;

  axios.interceptors.request.use(
    (config) => {
      if (config?.skipAuthRefresh) return config;
      const token = getToken();
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config || {};
      const responseStatus = error?.response?.status;

      if (!responseStatus || responseStatus !== 401 || originalRequest.skipAuthRefresh) {
        return Promise.reject(error);
      }
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      const requestUrl = originalRequest?.url || '';
      const isAuthEndpoint = requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/refresh') ||
        requestUrl.includes('/auth/logout');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (!getRefreshToken()) {
        clearSession();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        resolveRefreshQueue(null, newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        resolveRefreshQueue(refreshError, null);
        clearSession();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  interceptorsInitialized = true;
};
