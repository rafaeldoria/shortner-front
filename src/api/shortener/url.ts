import { api } from '../api';

export interface CreateUrlParams {
  originalUrl: string;
}

export const createUrl = (data: CreateUrlParams) =>
  api.post('/url/', data);
