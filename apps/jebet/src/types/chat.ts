export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

export interface Message {
  id: string;
  content: string;
  role: 'member' | 'admin';
  sender: string;
  createdAt: Date;
}

export interface ActiveUser {
  userId: string;
  username: string;
  avatar: string;
  socketId?: string;
  roomSize: number;
}

export interface ChatMessage {
  id: string;
  created_at: string;
  message: string;
  userId: string;
  workspaceId: string;
  type: MessageType;
}

export interface Paginations<T> {
  pages: {
    message: {
      count: number | null;
      pageTo: number;
      data: T[];
    };
  }[];
  pageParams: number[];
}
