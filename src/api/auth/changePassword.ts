import { api } from '../api';

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = (data: ChangePasswordParams) =>
  api.patch('/auth/password', data);
