import { Hono } from "hono";
import { editor } from "./route/editor";
import { folder } from "./route/folder";
import { workspace } from "./route/workspace";
import { webhook } from "./route/webhook";

export const note = new Hono()
  .route("/editor", editor)
  .route("/folder", folder)
  .route("/workspace", workspace)
  .route("/webhook", webhook);