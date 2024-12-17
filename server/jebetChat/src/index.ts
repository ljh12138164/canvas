import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'node:http';
import { cors } from 'hono/cors';

const app = new Hono().use(
  cors({
    origin: '*',
    credentials: true,
  })
);

const httpServer = serve({
  fetch: app.fetch,
  port: 8088,
});

const io = new Server(httpServer as HTTPServer, {
  /* options */
});

io.on('connection', (socket) => {
  // ...
});
