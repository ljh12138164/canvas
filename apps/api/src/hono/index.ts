import { Hono } from "hono";
import { board } from "./board";
import { design } from "./design";
import { jebt } from "./jebt";
// 跨域
import { cors } from "hono/cors";
import { form } from "./form";

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
  .route("/form", form);

export type App = typeof app;
export default app;
