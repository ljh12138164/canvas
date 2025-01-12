export interface Message {
  // 角色
  role: "user" | "model";
  // 消息
  message: { text: string }[];
}

export interface MessageArr {
  id: string;
  name: string;
  // 会话列表
  messages: Message[];
}

export interface Ai {
  id: string;

  // 会话列表
  messages: Message[];
}
