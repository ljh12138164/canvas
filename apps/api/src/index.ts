import { serve } from "@hono/node-server";
// import { createBunWebSocket } from "hono/bun";
import { env } from "./env";
import { Hono } from "hono";
// const { upgradeWebSocket, websocket } = createBunWebSocket();

export const app = new Hono()
  .basePath("/api")
  .get("/sdf", (c) => c.text("Hello World"));
// app.get(
//   "/ws",
//   upgradeWebSocket((c) => {
//     let intervalId: NodeJS.Timeout;
//     return {
//       onOpen(_event, ws) {
//         intervalId = setInterval(() => {
//           ws.send(new Date().toString());
//         }, 200);
//       },
//       onClose() {
//         clearInterval(intervalId);
//       },
//     };
//   })
// );

serve({
  fetch: app.fetch,
  port: env.PORT,
});
