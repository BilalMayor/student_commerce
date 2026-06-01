import { api } from './client'
import { Product } from '@/types'

export interface ProductsFilter {
  query?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sort?: 'latest' | 'cheapest' | 'popular' | 'rating'
  page?: number
  limit?: number
}

export interface CreateProductPayload {
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  imageUrl?: string
  productType?: 'DIGITAL' | 'PHYSICAL'
  fileUrl?: string
  fileSize?: number
  weight?: number
}

export const productsApi = {
  getAll: async (filter?: ProductsFilter) => {
    const res = await api.get<{ items: Product[]; total: number; page: number; limit: number }>('/products', filter as Record<string, string | number | undefined>)
    return res.items
  },

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`),

  create: (payload: CreateProductPayload) => {
    // Strip fields not accepted by deployed backend DTO
    const { imageUrl, fileSize, weight, ...cleanPayload } = payload
    return api.post<Product>('/products', cleanPayload)
  },

  update: (id: string, payload: Partial<CreateProductPayload>) => {
    const { imageUrl, fileSize, weight, ...cleanPayload } = payload as any
    return api.put<Product>(`/products/${id}`, cleanPayload)
  },

  delete: (id: string) =>
    api.delete(`/products/${id}`),
}
