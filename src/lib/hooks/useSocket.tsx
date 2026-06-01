'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import Cookies from 'js-cookie'
import { toast } from '@/lib/hooks/useToast'

function getToken(): string | null {
  let token: string | null = Cookies.get('token') || null
  if (!token && typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      try { token = JSON.parse(stored).state.token || null } catch (e) {}
    }
  }
  return token
}

export function useSocket(onNotificationReceived?: (notification: any) => void) {
  const socketRef = useRef<Socket | null>(null)
  const notifSocketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://uklsm4-production.up.railway.app'
    const t = getToken()
    if (!t) return

    // Root namespace socket (for chat)
    const socket = io(socketUrl, {
      auth: { token: t },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    })
    socketRef.current = socket

    // /notifications namespace socket
    const notifSocket = io(socketUrl + '/notifications', {
      auth: { token: t },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    })
    notifSocketRef.current = notifSocket

    notifSocket.on('new_notification', (data: any) => {
      toast.info(data.message || 'Anda menerima notifikasi baru!')
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try { new Notification('StudentCommerce', { body: data.message, icon: '/favicon.ico' }) } catch (e) {}
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              try { new Notification('StudentCommerce', { body: data.message, icon: '/favicon.ico' }) } catch (e) {}
            }
          })
        }
      }
      if (onNotificationReceived) { onNotificationReceived(data) }
    })

    return () => {
      socket.disconnect()
      notifSocket.disconnect()
    }
  }, [onNotificationReceived])

  return socketRef.current
}
