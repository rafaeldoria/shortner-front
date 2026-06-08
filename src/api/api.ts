import axios from 'axios';

const USERNAME_KEY = 'auth_username';

export function hasSession(): boolean {
  return Boolean(localStorage.getItem(USERNAME_KEY));
}

export function setSession(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(USERNAME_KEY);
}

export function getApiError(error: unknown): { status?: number; message?: string } {
  if (!axios.isAxiosError<{ message?: string }>(error)) {
    return {};
  }

  return {
    status: error.response?.status,
    message: error.response?.data?.message,
  };
}

// Dev uses the Vite proxy to avoid CORS; prod uses the API URL.
const baseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
