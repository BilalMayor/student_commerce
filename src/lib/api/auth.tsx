import { api } from './client'
import { User } from '@/types'

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string; role: 'BUYER' | 'SELLER' }
export interface AuthResponse { token: string; user: User }

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await api.post<any>('/auth/login', payload)
    return { token: res.accessToken, user: { id: res.userId, name: res.name, email: res.email, role: res.role } } as AuthResponse
  },

  register: async (payload: RegisterPayload) => {
    const res = await api.post<any>('/auth/register', payload)
    return { token: res.accessToken, user: { id: res.userId, name: res.name, email: res.email, role: res.role } } as AuthResponse
  },

  googleLogin: async (payload: { idToken: string; credential: string }) => {
    const res = await api.post<any>('/auth/google', payload)
    return { token: res.accessToken, user: { id: res.userId, name: res.name, email: res.email, role: res.role } } as AuthResponse
  },

  logout: () =>
    api.post('/auth/logout'),
}
