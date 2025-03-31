import type { App } from 'api';
import { hc } from 'hono/client';

export const clientAi = hc<App>('https://www.ljhboard.cn/').api.ai;
// 使用api的类型
export const client = hc<App>('https://www.ljhboard.cn/').api.design;
