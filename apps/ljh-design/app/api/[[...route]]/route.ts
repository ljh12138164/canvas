import user from "./user";
import image from "./image";
import { Hono } from "hono";
import { handle } from "hono/vercel";
export const runtime = "edge";

const app = new Hono()
  .basePath("/api")
  .route("/user", user)
  .route("/image", image);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
