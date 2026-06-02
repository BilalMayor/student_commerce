'use client'

import { toast as sonnerToast } from 'sonner'
import { create } from 'zustand'

// Keep store for backward compat with any code reading useToastStore
export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastState {
  toasts: ToastItem[]
  addToast: (message: string, type?: ToastItem['type']) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    if (type === 'success') sonnerToast.success(message)
    else if (type === 'error') sonnerToast.error(message)
    else sonnerToast(message)
  },
  removeToast: () => {},
}))

export function useToast() {
  const addToast = useToastStore((s) => s.addToast)
  return { addToast }
}

// Delegate to Sonner directly
export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast(message),
}
