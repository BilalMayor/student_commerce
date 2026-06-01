import { api } from './client'
import { CartItem } from '@/types'

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const data = await api.get<any>('/cart')
    const raw = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : [])
    return raw.map((item: any) => ({
      ...item,
      product: item.product ? {
        ...item.product,
        imageUrl: item.product.images?.[0]?.url || '',
      } : undefined,
    }))
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
