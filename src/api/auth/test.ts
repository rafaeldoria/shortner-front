import { api } from '../api';

export const testConnection = () => api.get<string>('/auth/test');
