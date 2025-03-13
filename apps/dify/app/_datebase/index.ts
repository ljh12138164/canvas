import type { App } from 'api';
import { hc } from 'hono/client';
// 使用api的类型
// 解析App
export const clientAi = hc<App>('https://www.ljhboard.cn/').api.ai;
