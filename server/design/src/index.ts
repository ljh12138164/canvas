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
  // console.log(socket);
  // 连接聊天
  socket.on('connectChat', (data: any) => {
    // 添加用户元数据
    // 断开连接
    socket.on('disconnect', () => {});
    // 发送消息
  });
  // 初始化聊天
  socket.on('initChat', (data: any) => {});
  // 发送消息
  socket.on('sendMessage', (data: any) => {});
  // 错误处理
  socket.on('error', (error: any) => {});

  // 意识感知
  socket.on('awareness', (data: any) => {});
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
