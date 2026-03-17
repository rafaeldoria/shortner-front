import { api } from '../api';

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export const register = (data: RegisterParams) =>
  api.post('/auth/register', data);
