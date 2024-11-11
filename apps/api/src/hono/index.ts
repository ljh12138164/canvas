import { Hono } from "hono";
import { board } from "./board";
import { jebt } from "./jebt";
import { design } from "./design";
import { cors } from "hono/cors";
import { upgradeWebSocket } from "hono/cloudflare-workers";
const app = new Hono()
  .use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  .basePath("/")
  .get("/", (c) => {
    return c.text("api启动成功");
  })
  .basePath("/api")
  .get(
    "/ws",
    upgradeWebSocket(() => {
      return {
        onMessage: (event) => {
          console.log(event.data);
        },
      };
    })
  )
  .route("/design", design)
  .route("/board", board)
  .route("/jebt", jebt);
export type App = typeof app;
export default app;
// serve(
//   {
//     fetch: app.fetch,
//     port: 8000,
//   },
//   (info) => {
//     console.log(info);
//     console.log(`Server is running on http://localhost:${info.port}`);
//   }
// );
