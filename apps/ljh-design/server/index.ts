import { hc } from 'hono/client';
import type { App } from 'api';

export const client = hc<App>(process.env.NEXT_PUBLIC_API_URL!).api.design;
