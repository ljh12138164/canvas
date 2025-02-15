import type { App } from 'api';
import { hc } from 'hono/client';

export const client = hc<App>('https://www.ljhboard.cn/').api.note;
// export const client = hc<App>('http://localhost:8000/').api.note;

export const ws = import.meta.env?.VITE_PUBLIC_WS || 'ws://localhost:8080';
// export const ws = 'ws://localhost:8080';
