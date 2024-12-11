import { Hono } from 'hono';

import { gemini } from './route/gemini';

export const ai = new Hono().route('/gemini', gemini);
