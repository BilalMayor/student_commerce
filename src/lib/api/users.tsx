import { api } from './client'
import { User } from '@/types'

export const usersApi = {
  getMe: () =>
    api.get<User>('/users/me'),

  getAll: () =>
    api.get<User[]>('/users'),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  updateMe: (payload: { name?: string; email?: string; avatarUrl?: string }) =>
    api.patch<User>('/users', payload),

  becomeSeller: (payload: { shopName: string; shopDescription: string; category?: string; shopLogo?: string }) =>
    api.post<User>('/users/become-seller', payload),

  verifyUser: (id: string) =>
    api.patch<User>(`/users/${id}/verify`),

  verifySeller: (id: string) =>
    api.patch<User>(`/users/${id}/verify-seller`),
}
