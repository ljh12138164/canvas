import { Hono } from 'hono';
import { editor } from './route/editor';

export const note = new Hono().route('/editor', editor);
