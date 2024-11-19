import { Hono } from "hono";
const board = new Hono().get("/", async (c) => {
  return c.json({ message: "hello" });
});
export default board;
