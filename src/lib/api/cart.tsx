import { api } from './client'
import { CartItem } from '@/types'

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const data = await api.get<any>('/cart')
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.items)) return data.items
    return []
  },

  addItem: async (productId: string, quantity: number = 1) => {
    try {
      return await api.post<CartItem>('/cart', { productId, quantity })
    } catch (e: any) {
      if (e.message?.toLowerCase().includes('stok') || e.message?.toLowerCase().includes('stock')) {
        throw new Error('Stok produk tidak mencukupi. Jika produk digital, pastikan stok diatur ke nilai positif atau tidak terbatas.')
      }
      throw e
    }
  },

  updateItem: (productId: string, quantity: number) =>
    api.patch<CartItem>('/cart', { productId, quantity }),

  removeItem: (productId: string) =>
    api.delete(`/cart/${productId}`),

  clearCart: () =>
    api.delete('/cart'),
}
