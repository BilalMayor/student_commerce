import { api } from './client'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  status: 'sent' | 'delivered' | 'read'
}

export const chatApi = {
  getConversation: (userId: string) =>
    api.get<ChatMessage[]>(`/chat/conversation/${userId}`),

  sendMessage: (receiverId: string, content: string) =>
    api.post<ChatMessage>('/chat/messages', { receiverId, content }),
}
