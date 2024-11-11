import { hc } from 'hono/client';
import type { App } from 'api';

export const client = hc<App>(import.meta.env.VITE_API_URL!).api.jebt;
