import type { App } from 'api';
import { hc } from 'hono/client';

export const client = hc<App>('https://www.ljhboard.cn/').api.jebt;
