import { serve } from "@hono/node-server";
import app from "../src/hono";
import { createBunWebSocket } from "hono/bun";
const { upgradeWebSocket, websocket } = createBunWebSocket();
app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onMessage: (event) => {
        console.log(event.data);
      },
    };
  })
);
serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(info);
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
