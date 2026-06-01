'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { authApi } from '@/lib/api/auth'
import Cookies from 'js-cookie'

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()
  const clearCart = useCartStore((s) => s.clear)

  const logout = async () => {
    try { await authApi.logout() } catch (_) {}
    Cookies.remove('token')
    storeLogout()
    clearCart()
  }

  return {
    user,
    isAuthenticated,
    setAuth,
    logout,
    isBuyer: user?.role === 'BUYER',
    isSeller: user?.role === 'SELLER',
    isAdmin: user?.role === 'ADMIN',
  }
}
