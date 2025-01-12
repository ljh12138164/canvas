import { Hono } from "hono";
import board from "./route/board";
import user from "./route/user";
import project from "./route/project";
import task from "./route/task";
import { chat } from "./route/chat";
import { storage } from "./route/stoage";
export const jebt = new Hono()
  .route("/board", board)
  .route("/user", user)
  .route("/project", project)
  .route("/task", task)
  .route("/chat", chat)
  .route("/storage", storage);
