// import { app } from "../src/hono";
// import { createBunWebSocket } from "hono/bun";
// const { websocket, upgradeWebSocket } = createBunWebSocket();

// app.get(
//   "/ws",
//   upgradeWebSocket((c) => {
//     return {
//       onMessage: (event) => {
//         console.log(event.data);
//       },
//     };
//   })
// );

// export default {
//   port: 8000,
//   fetch: app,
//   websocket,
// };
