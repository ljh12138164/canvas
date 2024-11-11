import { Hono } from "hono";
import user from "./route/user";
import image from "./route/image";
import board from "./route/board";

export const design = new Hono()
  .route("/user", user)
  .route("/image", image)
  .route("/board", board);
