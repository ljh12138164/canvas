import { Hono } from "hono";
import { editor } from "./route/editor";
import { board } from "./route/board";

export const note = new Hono().route("/editor", editor).route("/board", board);
