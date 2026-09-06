import axios from "axios";

export const TOKEN_STORAGE_KEY = "ecom_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
});

/** Attach or clear the bearer token used for every subsequent request. */
export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Prime the header on first load so a refresh keeps the session.
try {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (stored) setAuthToken(stored);
} catch {
  /* localStorage unavailable — treat as logged out */
}

let onUnauthorized: (() => void) | null = null;

/** Register a handler invoked when the API rejects a request with 401. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
