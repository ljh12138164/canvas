import { Hono } from "hono";
import { cors } from "hono/cors";
import { ai } from "./ai";
import { design } from "./design";
import { form } from "./form";
import { jebt } from "./jebt";
import { storage } from "./jebt/route/stoage";
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
  .route("/note", note)
  .route("/form", form)
  .route("/ai", ai)
  .route("/storage", storage);
// 质谱： 901990b9c3b253eb71e20617aa2ee4cc.2pChbHlMynsuHd1M

export type App = typeof app;
export default app;
