import ws from "ws";
// @ts-ignore
import { setupWSConnection } from "../node_modules/y-websocket/bin/utils";
import http from "http";

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 1234;
const wss = new ws.Server({ noServer: true });
const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = (ws: any) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});
// @ts-ignore
server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`);
});
