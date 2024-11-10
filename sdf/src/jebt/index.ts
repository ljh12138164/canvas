import { Hono } from "hono";

export const jebt = new Hono().basePath("/jebt").get("/", (c) => {
  return c.json({ message: "Hello World" });
});
