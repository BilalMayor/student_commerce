'use client'

import { create } from 'zustand'
import { Notification } from '@/types'
import { notificationsApi } from '@/lib/api/notifications'

interface NotificationState {
  unreadCount: number
  chatUnreadCount: number
  notifications: Notification[]
  loading: boolean
  fetchUnreadCount: () => Promise<void>
  fetchChatUnreadCount: () => Promise<void>
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  incrementUnread: () => void
  setNotifications: (notifications: Notification[]) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  chatUnreadCount: 0,
  notifications: [],
  loading: false,

  fetchUnreadCount: async () => {
    try {
      const res = await notificationsApi.getUnreadCount()
      set({ unreadCount: res.count })
    } catch {}
  },

  fetchChatUnreadCount: async () => {
    try {
      const res = await notificationsApi.getUnreadCount('CHAT')
      set({ chatUnreadCount: res.count })
    } catch {}
  },

  fetchNotifications: async () => {
    set({ loading: true })
    try {
      const data = await notificationsApi.getAll()
      set({ notifications: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationsApi.markAsRead(id)
      set((state) => ({
        unreadCount: Math.max(0, state.unreadCount - 1),
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
      }))
    } catch {}
  },

  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllAsRead()
      set((state) => ({
        unreadCount: 0,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }))
    } catch {}
  },

  incrementUnread: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }))
  },

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    })
  },
}))
