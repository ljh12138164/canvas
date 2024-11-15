import { Hono } from "hono";

export const board = new Hono().get("/", (c) => {
  return c.json({ message: "Hello World" });
});
