import { Hono } from "hono";
import { board } from "./src/hono/board";
import { vue } from "./src/hono/vue";
import { design } from "./src/hono/design";
import { jebt } from "./src/hono/jebt";
import { serve } from "@hono/node-server";
import { note } from "./src/hono/note";
import { cors } from "hono/cors";
// 跨域
const app = new Hono()
  .use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  .basePath("/api")
  .route("/design", design)
  .route("/jebt", jebt)
  .route("/board", board)
  .route("/note", note)
  .route("/vue", vue);

serve({
  fetch: app.fetch,
  port: 8000,
});
