import { api } from './client'
import { Notification } from '@/types'

export const notificationsApi = {
  getAll: () =>
    api.get<Notification[]>('/notifications'),

  getUnreadCount: (type?: string) =>
    api.get<{ count: number }>('/notifications/unread-count', { ...(type ? { type } : {}) }),

  markAsRead: (id: string) =>
    api.post(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.post('/notifications/read-all'),
}
