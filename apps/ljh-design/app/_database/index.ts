import type { App } from 'api';
import { hc } from 'hono/client';
// 使用api的类型
// 解析App
export const client = hc<App>('https://www.ljhboard.cn/').api.design;
// export const client = hc<App>('http://localhost:8000/').api.design;

export const clientAi = hc<App>('https://www.ljhboard.cn/').api.ai;
