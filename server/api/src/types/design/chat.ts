export interface Frident {
  id: string;
  created_at: string;
  userId: string;
  adduser: string;
  isInvite: boolean;
}

export type MessageType = 'message' | 'url';
export interface ChatMessage {
  created_at: string;
  sendId: string;
  converId: string;
  message: string;
  type: MessageType;
}
