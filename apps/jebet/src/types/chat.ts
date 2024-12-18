export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sender: string;
  createdAt: Date;
}

export interface ActiveUser {
  userId: string;
  username: string;
  avatar: string;
  socketId?: string;
}
