import api from './api';
import { Transaction, TransactionCreate, ApiResponse, PaginatedResponse } from '../types';

export const transactionService = {
  async create(data: TransactionCreate): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data.data!;
  },

  async submit(id: string): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>(`/transactions/${id}/submit`);
    return response.data.data!;
  },

  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    department_id?: number;
  }): Promise<PaginatedResponse<Transaction>> {
    const response = await api.get<PaginatedResponse<Transaction>>('/transactions', { params });
    return response.data;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data!;
  },

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
