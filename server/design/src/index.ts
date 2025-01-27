import http from 'node:http';
import ws from 'ws';
// @ts-ignore
import { setupWSConnection } from '../node_modules/y-websocket/bin/utils';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8888;
const wss = new ws.Server({ noServer: true });
const server = http.createServer((_, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

// 处理连接
wss.on('connection', setupWSConnection);

// 处理升级
server.on('upgrade', (request, socket, head) => {
  // 处理权限
  const handleAuth = (ws: any) => {
    // 权限管理
    wss.emit('connection', ws, request);
  };
  // 处理升级
  wss.handleUpgrade(request, socket, head, handleAuth);
});
// @ts-ignore
server.listen(port, host, () => {
  // console.log(`running at '${host}' on port ${port}`);
});
