import { hc } from "hono/client";
import type { App } from "api";

export const client = hc<App>(process.env.NUXT_PUBLIC_API_BASE!).api.form;
