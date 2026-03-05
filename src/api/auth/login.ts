import { api } from '../api';

export interface LoginParams {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = (data: LoginParams) =>
  api.post<LoginResponse>('/auth/login', data);
