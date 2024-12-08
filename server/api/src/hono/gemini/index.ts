import { Hono } from 'hono';

export const gemini = new Hono().get('/', (c) => c.text('Hello World'));
