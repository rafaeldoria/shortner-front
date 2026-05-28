import { api } from '../api';

export const logout = () => api.post('/auth/logout');
