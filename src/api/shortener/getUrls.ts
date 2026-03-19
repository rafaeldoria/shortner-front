import { api } from '../api';

export interface UrlItem {
  code: string;
  originalUrl: string;
  clicks: number;
}

export const getUrls = () => api.get<UrlItem[]>('/url/');
