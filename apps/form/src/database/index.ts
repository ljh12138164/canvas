import type { App } from 'api';
import { hc } from 'hono/client';

// export const client = hc<App>('http://localhost:8000').api.form
export const client = hc<App>('https://www.ljhboard.cn/').api.form;
