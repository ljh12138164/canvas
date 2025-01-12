export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Ai {
  id: string;
  messages: Message[];
  // 其他需要的字段...
}
