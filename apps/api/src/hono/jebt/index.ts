import { Hono } from "hono";
import board from "./route/board";
import user from "./route/user";
export const jebt = new Hono().route("/board", board).route("/user", user);
