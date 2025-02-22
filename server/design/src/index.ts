/// <reference path="../deno.json" />

// @ts-ignore
import { serve } from 'https://deno.land/std/http/server.ts';
import { WebSocketServer } from 'ws';
// @ts-ignore
import { setupWSConnection } from 'y-websocket/bin/utils';

// @ts-ignore
const host = Deno.env.get('HOST') || 'localhost';
// @ts-ignore
const port = Number.parseInt(Deno.env.get('PORT') || '8888');

new WebSocketServer({ noServer: true });

const handler = (request: Request): Response => {
  if (request.headers.get('upgrade') === 'websocket') {
    // @ts-ignore
    const { socket, response } = Deno.upgradeWebSocket(request);

    // 处理WebSocket连接
    socket.onopen = () => {
      setupWSConnection(socket, request);
    };

    return response;
  }

  return new Response('okay', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
};

await serve(handler, { port, hostname: host });
