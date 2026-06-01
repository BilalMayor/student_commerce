import { api } from './client'
import { Category } from '@/types'

export const categoriesApi = {
  getAll: () =>
    api.get<Category[]>('/categories'),

  getBySlug: (slug: string) =>
    api.get<Category>(`/categories/by-slug/${slug}`),

  create: (payload: { name: string; slug: string; iconUrl?: string }) =>
    api.post<Category>('/categories', payload),

  delete: (id: string) =>
    api.delete(`/categories/${id}`),
}
