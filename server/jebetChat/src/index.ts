import type { Server as HTTPServer } from 'node:http';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Server } from 'socket.io';
//ws 服务
const app = new Hono().use(
  cors({
    origin: (origin) => origin || '*',
    credentials: true,
  }),
);

const httpServer = serve({
  fetch: app.fetch,
  port: 8088,
});

const io = new Server(httpServer as HTTPServer, {
  /* options */
  cors: {
    origin: '*',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // 连接聊天
  socket.on('connectChat', (data) => {
    // 添加用户元数据
    const userMeta = {
      workspaceId: data.workspaceId,
      userId: data.userId,
      username: data.username,
      avatar: data.avatar,
      // 时间戳
      timestamps: new Date(),
      socketId: socket.id,
    };
    socket.join(data.workspaceId);
    const roomSize = io.sockets.adapter.rooms.get(data.workspaceId)?.size || 0;

    // 广播用户加入信息和元数据
    socket.to(data.workspaceId).emit('joinChat', {
      ...data,
      roomSize,
      userMeta,
      type: 'join', // 标识消息类型
    });
    socket.emit(`${data.workspaceId}:initChat`, {
      roomSize,
    });
    // 断开连接
    socket.on('disconnect', () => {
      const roomSize = io.sockets.adapter.rooms.get(data.workspaceId)?.size || 0;
      socket.to(data.workspaceId).emit('leaveChat', {
        socketId: socket.id,
        roomId: data.workspaceId,
        roomSize,
        // 时间戳
        timestamp: new Date(),
      });
    });
    // 发送消息
  });
  // 初始化聊天
  socket.on('initChat', (data) => {
    const roomSize = io.sockets.adapter.rooms.get(data.workspaceId)?.size || 0;
    // 广播初始化消息
    socket.to(data.workspaceId).emit('initChat', {
      roomSize,
    });
  });
  // 发送消息
  socket.on('sendMessage', (data) => {
    const roomSize = io.sockets.adapter.rooms.get(data.workspaceId)?.size || 0;

    // 在消息中添加发送时间和用户信息
    const messageData = {
      ...data,
      roomSize,
      meta: {
        timestamp: data.timestamp,
        socketId: socket.id,
        userId: data.userId,
        username: data.username,
        avatar: data.avatar,
      },
    };

    socket.to(data.workspaceId).emit('sendMessage', messageData);
  });
  // 错误处理
  socket.on('error', (error) => {
    console.error('WebSocket 错误:', error);
  });

  // 意识感知
  socket.on('awareness', (data) => {
    socket.to(data.documentId).emit('awareness', data.awareness);
  });
});
