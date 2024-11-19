import { Hono } from 'hono';
import board from './route/board';
export const jebt = new Hono().route('/board', board);
