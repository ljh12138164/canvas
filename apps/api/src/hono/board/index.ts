import { Hono } from 'hono';

export const board = new Hono();
board.get('/', (c) => c.text('board')).post('/', (c) => c.json('board'));
