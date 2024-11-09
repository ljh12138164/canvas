// client.ts
import { hc } from "hono/client";
import type { WebSocketApp } from "../../../api/src/index";

export const client = hc<WebSocketApp>("http://localhost:8000");
