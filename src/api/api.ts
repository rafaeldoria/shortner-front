import axios from 'axios';

const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, username: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
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

// Em dev usa proxy do Vite (evita CORS); em prod usa a URL da API
const baseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
