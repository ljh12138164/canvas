import { Hono } from "hono";
import { board } from "./board";
import { design } from "./design";
import { form } from "./form";
import { jebt } from "./jebt";
import { vue } from "./vue";
// 跨域
import { cors } from "hono/cors";
import ws from "./ws";

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
  .route("/design", design)
  .route("/board", board)
  .route("/jebt", jebt)
  .route("/form", form)
  .route("/vue", vue)
  .route("/ws", ws);

export type App = typeof app;
export default app;
