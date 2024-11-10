import { Hono } from "hono";
import { board } from "./board";
import { jebt } from "./jebt";
export const app = new Hono()
  .basePath("/api")
  .route("/board", board)
  .route("/jebt", jebt);
