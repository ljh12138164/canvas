import { Hono } from "hono";
import { board } from "./board";
import { design } from "./design";
import { jebt } from "./jebt";
import { cors } from "hono/cors";
import { note } from "./note";
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
  .route("/note", note);

export type App = typeof app;
export default app;