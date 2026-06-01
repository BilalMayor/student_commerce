'use client'

import { useState } from 'react'
import { cartApi } from '@/lib/api/cart'
import { useCartStore } from '@/lib/store/cartStore'

export function useCart() {
  const { items, setItems, clear } = useCartStore()
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    setLoading(true)
    try {
      const data = await cartApi.getCart()
      setItems(data)
    } catch (_) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    setLoading(true)
    try {
      await cartApi.addItem(productId, quantity)
      await fetchCart()
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    setLoading(true)
    try {
      await cartApi.updateItem(productId, quantity)
      await fetchCart()
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    setLoading(true)
    try {
      await cartApi.removeItem(productId)
      await fetchCart()
    } finally {
      setLoading(false)
    }
  }

  const clearAll = async () => {
    setLoading(true)
    try {
      await cartApi.clearCart()
      clear()
    } finally {
      setLoading(false)
    }
  }

  return {
    items,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearAll,
  }
}
