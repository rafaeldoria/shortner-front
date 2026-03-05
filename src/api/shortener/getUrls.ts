import { api } from '../api';

export interface UrlItem {
  code: string;
  originalUrl: string;
}

export const getUrls = () => api.get<UrlItem[]>('/url/');
