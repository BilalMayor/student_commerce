import { api } from './client'
import { Address } from '@/types'

export interface AddressPayload {
  label: string
  recipientName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  isDefault?: boolean
}

export const addressesApi = {
  getAll: () =>
    api.get<Address[]>('/addresses'),

  getById: (id: string) =>
    api.get<Address>(`/addresses/${id}`),

  create: (payload: AddressPayload) =>
    api.post<Address>('/addresses', payload),

  update: (id: string, payload: Partial<AddressPayload>) =>
    api.patch<Address>(`/addresses/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/addresses/${id}`),
}
