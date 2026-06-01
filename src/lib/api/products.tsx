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
}

export const productsApi = {
  getAll: async (filter?: ProductsFilter) => {
    const res = await api.get<{ items: any[]; total: number; page: number; limit: number }>('/products', filter as Record<string, string | number | undefined>)
    return res.items.map((p: any) => ({
      ...p,
      imageUrl: p.images?.[0]?.url || '',
      sellerName: p.seller?.name,
    }))
  },

  getById: (id: string) =>
    api.get<any>(`/products/${id}`).then((p: any) => ({
      ...p,
      imageUrl: p.images?.[0]?.url || '',
      sellerName: p.seller?.name,
    })),

  create: (payload: CreateProductPayload) => {
    const { fileSize, weight, ...cleanPayload } = payload as any
    return api.post<any>('/products', cleanPayload).then((p: any) => ({
      ...p,
      imageUrl: p.images?.[0]?.url || '',
    }))
  },

  update: (id: string, payload: Partial<CreateProductPayload>) => {
    const { fileSize, weight, ...cleanPayload } = payload as any
    return api.put<any>(`/products/${id}`, cleanPayload).then((p: any) => ({
      ...p,
      imageUrl: p.images?.[0]?.url || '',
    }))
  },

  delete: (id: string) =>
    api.delete(`/products/${id}`),
}
