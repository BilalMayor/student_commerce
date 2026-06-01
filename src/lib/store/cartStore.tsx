'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  totalItems: () => number
  setItems: (items: CartItem[]) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: () => {
        const currentItems = get().items;
        return Array.isArray(currentItems) ? currentItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
      },
      setItems: (items) => set({ items }),
      clear: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
)
