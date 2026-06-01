'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSocket } from '@/lib/hooks/useSocket'
import { useAuth } from '@/lib/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import { chatApi } from '@/lib/api/chat'
import { User } from '@/types'
import { Send, Search, MessageSquare, ArrowLeft, Check, CheckCheck, Smile, ShieldAlert } from 'lucide-react'
import { toast } from '@/lib/hooks/useToast'
import Image from 'next/image'

interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  status: 'sent' | 'delivered' | 'read'
}

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get('userId')
  const { user: currentUser, isAuthenticated } = useAuth()
  
  // Contacts and active conversation
  const [contacts, setContacts] = useState<User[]>([])
  const [activeContact, setActiveContact] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [wsConnected, setWsConnected] = useState(false)

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  
  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null)
  const activeContactRef = useRef<User | null>(null)
  const pendingQueueRef = useRef<string[]>([])

  // Initialize socket
  const socket = useSocket((notification) => {
    // If we receive a message notification, handle it accordingly
    console.log('Notification received on chat page:', notification)
  })

  // Keep activeContactRef in sync
  useEffect(() => {
    activeContactRef.current = activeContact
  }, [activeContact])

  // Load contacts (all users except current user)
  useEffect(() => {
    if (!isAuthenticated) return

    usersApi.getAll()
      .then((data) => {
        const filtered = data.filter((u) => u.id !== currentUser?.id)
        setContacts(filtered)
        
        // If a target userId was specified in URL params, pre-select it
        if (targetUserId) {
          const match = filtered.find((u) => u.id === targetUserId)
          if (match) setActiveContact(match)
        } else if (filtered[0]) {
          setActiveContact(filtered[0])
        }
      })
      .catch(() => toast.error('Gagal memuat daftar kontak'))
      .finally(() => setLoadingContacts(false))
  }, [isAuthenticated, currentUser, targetUserId])

  // Track WebSocket connection status
  useEffect(() => {
    if (!socket) {
      setWsConnected(false)
      return
    }
    const onConnect = () => setWsConnected(true)
    const onDisconnect = () => setWsConnected(false)
    const onError = () => setWsConnected(false)
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onError)
    setWsConnected(socket.connected)
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onError)
    }
  }, [socket])

  // Set up realtime message listeners
  useEffect(() => {
    if (!socket) return

    // Event listener for receiving message
    const handleReceiveMessage = (msg: any) => {
      // Check if message belongs to active conversation
      const currentActive = activeContactRef.current
      if (
        (msg.senderId === currentActive?.id && msg.receiverId === currentUser?.id) ||
        (msg.senderId === currentUser?.id && msg.receiverId === currentActive?.id)
      ) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.id === msg.id)) return prev
          return [...prev, {
            id: msg.id || String(Date.now()),
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content || msg.message,
            createdAt: msg.createdAt || new Date().toISOString(),
            status: msg.status || 'read'
          }]
        })
      } else {
        // Trigger notification toast for background message
        const sender = contacts.find((c) => c.id === msg.senderId)
        toast.info(`Pesan baru dari ${sender?.name || 'Pengguna'}: ${msg.content || msg.message}`)
      }
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('message', handleReceiveMessage)
    socket.on('new_message', handleReceiveMessage)

    // Update local message status when server confirms sent
    const handleMessageSent = (msg: any) => {
      const tempId = pendingQueueRef.current.shift()
      if (tempId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, id: msg.id, status: 'delivered' } : m,
          ),
        )
      }
    }
    socket.on('message_sent', handleMessageSent)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('message', handleReceiveMessage)
      socket.off('new_message', handleReceiveMessage)
      socket.off('message_sent', handleMessageSent)
    }
  }, [socket, currentUser, contacts])

  // Scroll to bottom only when user is near bottom or on new incoming message
  const isNearBottom = useRef(true)
  useEffect(() => {
    const container = messageEndRef.current?.parentElement
    if (!container) return
    const handleScroll = () => {
      const threshold = 100
      isNearBottom.current = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const prevMsgLenRef = useRef(0)
  useEffect(() => {
    if (messages.length > prevMsgLenRef.current && isNearBottom.current) {
      messageEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
    prevMsgLenRef.current = messages.length
  }, [messages])

  // Polling fallback for messages when WebSocket is disconnected
  const [polling, setPolling] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!activeContact || !currentUser) {
      setMessages([])
      return
    }

    const loadMessages = () =>
      chatApi.getConversation(activeContact.id)
        .then((data) => {
          const newData = Array.isArray(data) ? data : []
          setMessages((prev) => {
            const existingIds = new Set(newData.map((m) => m.id))
            const temps = prev.filter((m) => {
              if (!m.id.startsWith('temp-')) return false
              const hasMatch = newData.some((s) => s.content === m.content && s.senderId === m.senderId)
              return !hasMatch
            })
            if (temps.length === 0 && prev.length === newData.length && prev.every((m, i) => m.id === newData[i].id)) {
              return prev
            }
            return [...newData, ...temps]
          })
        })
        .catch(() => {})

    loadMessages()

    const isSocketConnected = socket?.connected ?? false
    if (!isSocketConnected) {
      setPolling(true)
      pollingRef.current = setInterval(loadMessages, 5000)
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
      setPolling(false)
    }
  }, [activeContact, currentUser, socket, socket?.connected])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeContact || !currentUser) return

    const tempId = 'temp-' + Date.now()
    pendingQueueRef.current.push(tempId)
    const newMsg: ChatMessage = {
      id: tempId,
      senderId: currentUser.id,
      receiverId: activeContact.id,
      content: inputText,
      createdAt: new Date().toISOString(),
      status: 'sent'
    }

    setMessages((prev) => [...prev, newMsg])
    setInputText('')

    if (socket && socket.connected) {
      socket.emit('send_message', {
        receiverId: activeContact.id,
        message: newMsg.content,
        content: newMsg.content
      })
    } else {
      chatApi.sendMessage(activeContact.id, newMsg.content).then(() => {
        return chatApi.getConversation(activeContact.id)
      }).then((data) => {
        const newData = Array.isArray(data) ? data : []
        setMessages((prev) => {
          const serverIds = new Set(newData.map((m) => m.id))
          const filtered = prev.filter((m) => {
            if (!m.id.startsWith('temp-')) return false
            const hasMatch = newData.some((s) => s.content === m.content && s.senderId === m.senderId)
            return !hasMatch
          })
          return [...newData, ...filtered]
        })
      }).catch(() => {})
    }
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-4">
        <ShieldAlert size={64} className="text-primary/70 animate-bounce" />
        <h1 className="text-xl sm:text-2xl font-black text-ink">Akses Dibatasi</h1>
        <p className="text-muted text-sm max-w-sm">Anda harus masuk ke akun Anda terlebih dahulu untuk memulai percakapan realtime.</p>
        <button onClick={() => router.push('/login?redirect=/chat')} className="rounded-2xl bg-primary px-6 py-3.5 text-xs font-bold text-white shadow-soft hover:bg-primary-dark transition-all">
          Masuk Sekarang
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6 h-[85vh] flex gap-4">
      {/* Contact Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border border-border/70 rounded-[2.25rem] shadow-soft flex flex-col overflow-hidden shrink-0 ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        {/* Header Search */}
        <div className="p-5 border-b border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-ink tracking-tight flex items-center gap-2">
              <MessageSquare className="text-primary" size={22} />
              <span>Percakapan</span>
            </h1>
            <button onClick={() => router.push('/')} className="text-muted hover:text-ink text-xs font-bold md:hidden flex items-center gap-1">
              <ArrowLeft size={14} /> Beranda
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3 text-muted/50" size={16} />
            <input
              type="text"
              placeholder="Cari kontak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border/60 rounded-2xl text-xs font-bold text-ink outline-none focus:border-primary placeholder:text-muted/50 transition-colors"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingContacts ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-full bg-surface animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs font-bold text-muted">Kontak tidak ditemukan</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                  activeContact?.id === contact.id
                    ? 'bg-primary/5 border-primary/20 shadow-sm'
                    : 'border-transparent hover:bg-surface/50'
                }`}
              >
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center shrink-0">
                  {contact.avatarUrl ? (
                    <img src={contact.avatarUrl} alt={contact.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-primary">{contact.name[0]}</span>
                  )}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs sm:text-sm font-bold text-ink truncate">{contact.name}</p>
                    <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-surface border border-border text-muted">
                      {contact.role}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-muted/80 truncate mt-1">Klik untuk mulai chat</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Active Conversation Pane */}
      <div className={`flex-1 bg-white border border-border/70 rounded-[2.25rem] shadow-soft flex flex-col overflow-hidden relative ${!activeContact ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {activeContact ? (
          <>
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-surface/10">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setActiveContact(null)} className="p-2 hover:bg-surface rounded-xl text-muted hover:text-ink md:hidden shrink-0">
                  <ArrowLeft size={18} />
                </button>
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center shrink-0">
                  {activeContact.avatarUrl ? (
                    <img src={activeContact.avatarUrl} alt={activeContact.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-primary">{activeContact.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate leading-tight">{activeContact.name}</p>
                  <span className="inline-flex items-center gap-1 mt-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${wsConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'} `} />
                    <span className={`text-[10px] font-bold ${wsConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {wsConnected ? 'Online' : polling ? 'Polling...' : 'Menghubungkan...'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface/5">
              {messages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-[1.75rem] px-4 py-3 shadow-soft border ${
                      isMine
                        ? 'bg-primary text-white border-primary/20 rounded-tr-none'
                        : 'bg-white text-ink border-border/75 rounded-tl-none'
                    }`}>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed break-words">{msg.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1.5">
                        <span className={`text-[9px] font-semibold tracking-wide ${isMine ? 'text-white/80' : 'text-muted/65'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMine && (
                          <span className="text-white/85">
                            {msg.status === 'sent' && <Check size={11} />}
                            {msg.status === 'delivered' && <CheckCheck size={11} />}
                            {msg.status === 'read' && <CheckCheck size={11} className="text-accent" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messageEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/60 bg-white flex items-center gap-3">
              <button type="button" className="p-2 hover:bg-surface rounded-xl text-muted/70 hover:text-ink shrink-0 transition-colors">
                <Smile size={20} />
              </button>
              <input
                type="text"
                placeholder="Tulis pesan..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 bg-surface border border-border/60 rounded-2xl text-xs font-semibold text-ink outline-none focus:border-primary placeholder:text-muted/40 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-soft hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center p-10 max-w-sm space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
              <MessageSquare size={30} />
            </div>
            <div>
              <h3 className="text-sm font-black text-ink">Buka Percakapan</h3>
              <p className="text-xs text-muted font-medium mt-1 leading-relaxed">
                Pilih salah satu kontak di panel kiri untuk memulai obrolan realtime dan berdiskusi produk secara langsung.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
