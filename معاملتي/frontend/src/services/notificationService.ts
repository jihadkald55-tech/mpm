import api from './api';
import { Notification, ApiResponse, PaginatedResponse } from '../types';

export const notificationService = {
  async getAll(params?: { page?: number; limit?: number; is_read?: boolean }): Promise<PaginatedResponse<Notification>> {
    const response = await api.get<PaginatedResponse<Notification>>('/notifications', { params });
    return response.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data.data!;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data.data!.count;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};
