import { Hono } from "hono";
const ws = new Hono().get("/ws", (c) => {
  return c.json("hello");
});

export default ws;
