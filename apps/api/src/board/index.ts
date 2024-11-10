import { Hono } from "hono";

export const board = new Hono()
  .basePath("/board")
  .get("/", (c) => c.text("board"));
