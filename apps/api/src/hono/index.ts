import { Hono } from "hono";
import { board } from "./board";
import { jebt } from "./jebt";
import { design } from "./design";
import { cors } from "hono/cors";
// import { serve } from "@hono/node-server";
const app = new Hono()
  .use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  .basePath("/api")
  .route("/design", design)
  .route("/board", board)
  .route("/jebt", jebt);
export type App = typeof app;
export default app;
// serve({
//   fetch: app.fetch,
//   port: 8000,
// });
