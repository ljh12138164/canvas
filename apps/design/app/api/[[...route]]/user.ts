import { Hono } from "hono";

const user = new Hono().get("/", (c) => {
  return c.json({ message: "Hello World!" });
});

export default user;
