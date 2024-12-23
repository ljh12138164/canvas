import { Hono } from 'hono';
import { board } from './route/board';

export const form = new Hono().route('/board', board);
