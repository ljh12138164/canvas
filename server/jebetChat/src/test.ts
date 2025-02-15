// @ts-ignore
import { Server } from 'https://deno.land/x/socket_io@0.2.1/mod.ts';

const io = new Server({
  /* options */
  cors: {
    origin: '*',
    credentials: true,
  },
  addTrailingSlash: false,
  path: '/socket.io/',
});

io.on('connection', (socket: any) => {
  // 连接聊天
  socket.on('connectChat', (data: any) => {
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
    const roomSize = Array.from(io.of('/').adapter.rooms.get(data.workspaceId) || []).length;

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
      const roomSize = Array.from(io.of('/').adapter.rooms.get(data.workspaceId) || []).length;
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
  socket.on('initChat', (data: any) => {
    const roomSize = Array.from(io.of('/').adapter.rooms.get(data.workspaceId) || []).length;
    // 广播初始化消息
    socket.to(data.workspaceId).emit('initChat', {
      roomSize,
    });
  });
  // 发送消息
  socket.on('sendMessage', (data: any) => {
    const roomSize = Array.from(io.of('/').adapter.rooms.get(data.workspaceId) || []).length;

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
  socket.on('error', (error: any) => {
    console.error('WebSocket 错误:', error);
  });

  // 意识感知
  socket.on('awareness', (data: any) => {
    socket.to(data.documentId).emit('awareness', data.awareness);
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
