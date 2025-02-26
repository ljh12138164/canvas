// @ts-ignore
import { Server } from 'https://deno.land/x/socket_io@0.2.1/mod.ts';
// @ts-ignore
import type { Socket } from 'socket.io';

const io = new Server({
  /* options */
  cors: {
    origin: '*',
    credentials: true,
  },
  addTrailingSlash: false,
  path: '/socket.io/',
});

interface ChatMessage {
  sendId: string;
  converId: string;
  type: string;
  message: string;
  created_at?: string;
  conversationId?: string;
}

// 用于存储在线用户
const onlineUsers = new Map();

io.on('connection', (socket: Socket) => {
  // 连接聊天
  socket.on('connectChat', (userId: string) => {
    // 添加用户元数据
    onlineUsers.set(userId, socket.id);
    socket.join(userId);

    // 断开连接
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
    });
  });

  // 初始化聊天
  socket.on('initChat', (data: { userId: string }) => {
    // 加入用户的聊天室
    socket.join(data.userId);
  });

  // 发送消息
  socket.on('sendMessage', (data: ChatMessage) => {
    // 创建会话ID
    const conversationId = [data.sendId, data.converId].sort().join('_');

    // 添加时间戳和会话ID
    const messageWithTimestamp = {
      ...data,
      created_at: new Date().toISOString(),
      conversationId: conversationId,
    };

    // 发送到特定会话频道
    io.emit(`chat:${conversationId}`, messageWithTimestamp);
  });

  // 错误处理
  socket.on('error', (error: Error) => {
    socket.emit('errorEvent', { message: '发生错误，请重试' });
  });

  // 意识感知（正在输入等状态）
  socket.on('awareness', (data: { userId: string; targetId: string; status: string }) => {
    io.to(data.targetId).emit('awarenessUpdate', {
      userId: data.userId,
      status: data.status,
    });
  });
});

// @ts-ignore
Deno.serve(
  {
    // @ts-ignore
    port: Number(Deno.env.get('PORT')) || 8088,
    hostname: '0.0.0.0',
  },
  io.handler(),
);
