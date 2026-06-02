import { api } from '../api';

export interface CreateUrlParams {
  originalUrl: string;
}

export const createUrl = (data: CreateUrlParams) =>
  api.post('/url/', data);

export type UpdateUrlParams = CreateUrlParams;

export const updateUrl = (code: string, data: UpdateUrlParams) =>
  api.patch(`/url/${encodeURIComponent(code)}`, data);

export const deleteUrl = (code: string) =>
  api.delete(`/url/${encodeURIComponent(code)}`);
