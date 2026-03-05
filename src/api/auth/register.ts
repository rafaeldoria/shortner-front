import { api } from '../api';

export interface RegisterParams {
  login: string;
  password: string;
}

export const register = (data: RegisterParams) =>
  api.post('/auth/register', data);
