import { api } from './client'
import { Payment, PaymentStatus } from '@/types'

export const paymentsApi = {
  getByOrderId: (orderId: string) =>
    api.get<Payment>(`/payments/${orderId}`),

  updateStatus: (orderId: string, status: PaymentStatus) =>
    api.patch<Payment>(`/payments/${orderId}/status`, { status }),
}
