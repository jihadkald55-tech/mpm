import api from './api';
import { Province, Department, TransactionType, RejectionReason, Statistics, ApiResponse } from '../types';

export const generalService = {
  async getProvinces(): Promise<Province[]> {
    const response = await api.get<ApiResponse<Province[]>>('/general/provinces');
    return response.data.data!;
  },

  async getDepartments(params?: { province_id?: number; type?: string }): Promise<Department[]> {
    const response = await api.get<ApiResponse<Department[]>>('/general/departments', { params });
    return response.data.data!;
  },

  async getTransactionTypes(department_type?: string): Promise<TransactionType[]> {
    const response = await api.get<ApiResponse<TransactionType[]>>('/general/transaction-types', {
      params: { department_type },
    });
    return response.data.data!;
  },

  async getRejectionReasons(category?: string): Promise<RejectionReason[]> {
    const response = await api.get<ApiResponse<RejectionReason[]>>('/general/rejection-reasons', {
      params: { category },
    });
    return response.data.data!;
  },

  async getStatistics(): Promise<Statistics> {
    const response = await api.get<ApiResponse<Statistics>>('/general/statistics');
    return response.data.data!;
  },
};
