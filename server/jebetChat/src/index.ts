import fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import 'fastify';
import fastifyCors from '@fastify/cors'; // 引入 fastify-cors
import { Server as SocketIOServer } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: SocketIOServer;
  }
}
const server = fastify();
server.register(fastifyCors, {
  origin: 'http://localhost:8100', // 允许的来源
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 允许的 HTTP 方法
  credentials: true, // 如果需要支持凭证（如 cookies），则设置为 true
});
server.register(fastifyIO);

server.get('/', (req, reply) => {
  server.io.emit('hello');
});

server.ready().then(() => {
  // 等待服务器准备好，否则 `server.io` 是未定义的
  server.io.on('connection', (socket) => {
    console.log('连接成功');
    // 你可以在这里添加更多的事件处理逻辑
  });
});

console.log('服务启动成功8088');
server.listen({ port: 8088 });
