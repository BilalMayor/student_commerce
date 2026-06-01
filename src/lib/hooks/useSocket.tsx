'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Cookies from 'js-cookie'
import { toast } from '@/lib/hooks/useToast'
import { useNotificationStore } from '@/lib/store/notificationStore'

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

let rootSocket: Socket | null = null
let notifSocket: Socket | null = null
let currentToken: string | null = null
const notifListeners = new Set<(notification: any) => void>()
function initSockets(token: string) {
  if (rootSocket?.connected && currentToken === token) return
  if (!token) return

  if (rootSocket) {
    rootSocket.removeAllListeners()
    rootSocket.disconnect()
  }
  if (notifSocket) {
    notifSocket.removeAllListeners()
    notifSocket.disconnect()
  }

  currentToken = token

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://uklsm4-production.up.railway.app'

  rootSocket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
  })

  notifSocket = io(socketUrl + '/notifications', {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
  })

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
    useNotificationStore.getState().incrementUnread()
    notifListeners.forEach((cb) => cb(data))
  })
}

export function useSocket(onNotificationReceived?: (notification: any) => void) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    initSockets(token)
    setSocket(rootSocket)
  }, [])

  useEffect(() => {
    if (!onNotificationReceived) return
    notifListeners.add(onNotificationReceived)
    return () => { notifListeners.delete(onNotificationReceived) }
  }, [onNotificationReceived])

  return socket
}
