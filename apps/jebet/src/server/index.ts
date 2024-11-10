import { hc } from "hono/client";
import type { App } from "../../../api/src/index";

export const client = hc<App>(import.meta.env.VITE_API_URL!);
