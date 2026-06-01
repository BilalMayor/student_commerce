import { api } from './client'
import { Order } from '@/types'

export const ordersApi = {
  getAll: () =>
    api.get<Order[]>('/orders'),

  getSellerOrders: () =>
    api.get<Order[]>('/orders/seller'),

  getAllOrders: () =>
    api.get<Order[]>('/orders/admin'),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`),

  create: (payload: { addressId: string; paymentMethod: 'TRANSFER' }) =>
    api.post<Order>('/orders', payload),

  payOrder: (id: string) =>
    api.patch<Order>(`/orders/${id}/pay`),

  cancelOrder: (id: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status: 'CANCELLED' }),

  updateStatus: (id: string, status?: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),

  verifyOrder: (id: string, action: 'accept' | 'reject') =>
    api.patch<Order>(`/orders/${id}/verify`, { action }),
}
