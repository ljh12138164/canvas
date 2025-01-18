import { Hono } from "hono";
import { board } from "./route/board";
import { submit } from "./route/sumbit";

export const form = new Hono().route("/board", board).route("/submit", submit);
