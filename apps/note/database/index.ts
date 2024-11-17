import { hc } from "hono/client";
import type { App } from "api";

export const api = hc<App>("http://localhost:8000/").api.note;
