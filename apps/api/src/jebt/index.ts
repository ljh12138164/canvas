import { Hono } from "hono";
export const jebt = new Hono().get("/", (c) => {
  c.header("Access-Control-Allow-Origin", "*");
  return c.json({ message: "Hello World" });
});
