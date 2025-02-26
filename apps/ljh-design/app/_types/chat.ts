export type MessageType = 'message' | 'url';
export interface ChatMessage {
  created_at: string;
  sendId: string;
  converId: string;
  message: string;
  type: 'message' | 'url';
  conversationId?: string;
}
