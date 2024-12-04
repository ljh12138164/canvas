import { Hono } from "hono";
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
  .route("/note", note);

serve({
  fetch: app.fetch,
  port: 8000,
});
