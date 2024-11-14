import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";
const ws = new Hono().get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send("Hello from server!");
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);

export default ws;
