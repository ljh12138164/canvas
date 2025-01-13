export interface Message {
  // 角色
  role: 'user' | 'model';
  // 消息
  parts: { text: string }[];
}

export interface MessageArr {
  id: string;
  name?: string;
  // 会话列表
  history: Message[];
}

export interface Ai {
  id: string;

  // 会话列表
  messages: Message[];
}
