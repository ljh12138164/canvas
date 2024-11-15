import type { App } from "api";
import { hc } from "hono/client";
export const client = hc<App>(process.env.NUXT_PUBLIC_API_BASE!).api.design;
