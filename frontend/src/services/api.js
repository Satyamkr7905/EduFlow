import axios from 'axios';
import { API_PRODUCTION_URL, STORAGE_KEYS } from '../utils/constants';

export const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? API_PRODUCTION_URL : '/api')
).replace(/\/$/, '');

/** Token lives in localStorage ("remember me") or sessionStorage. */
export const tokenStorage = {
  get() {
    return localStorage.getItem(STORAGE_KEYS.token) || sessionStorage.getItem(STORAGE_KEYS.token);
  },
  set(token, remember) {
    this.clear();
    (remember ? localStorage : sessionStorage).setItem(STORAGE_KEYS.token, token);
  },
  clear() {
    localStorage.removeItem(STORAGE_KEYS.token);
    sessionStorage.removeItem(STORAGE_KEYS.token);
  },
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Lets AuthContext react to 401s (expired/invalid token) without a circular import.
let unauthorizedHandler = null;
export const onUnauthorized = (handler) => {
  unauthorizedHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginCall = error.config?.url?.includes('/auth/login');
    if (status === 401 && !isLoginCall && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(normalizeError(error));
  }
);

/** Convert any axios error into a predictable shape. */
export const normalizeError = (error) => {
  if (error.response) {
    const { data, status } = error.response;
    return {
      status,
      message: data?.message || 'Request failed',
      errors: data?.errors || [],
    };
  }
  if (error.code === 'ECONNABORTED') {
    return { status: 0, message: 'The request timed out. Please try again.', errors: [] };
  }
  return {
    status: 0,
    message: 'Unable to reach the server. Check your connection and try again.',
    errors: [],
  };
};

export default api;
