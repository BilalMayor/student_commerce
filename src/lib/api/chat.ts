import { api } from './client'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  status: 'sent' | 'delivered' | 'read'
}

export interface ConversationItem {
  contact: {
    id: string
    name: string
    avatarUrl?: string
  }
  lastMessage: ChatMessage | null
  unreadCount: number
}

export const chatApi = {
  getConversations: () =>
    api.get<ConversationItem[]>('/chat/conversations'),

  getConversation: (userId: string) =>
    api.get<ChatMessage[]>(`/chat/conversation/${userId}`),

  sendMessage: (receiverId: string, content: string) =>
    api.post<ChatMessage>('/chat/messages', { receiverId, content }),
}
