import { Hono } from 'hono';
import { editor } from './route/editor';
import { board } from './route/board';
import { workspace } from './route/workspace';

export const note = new Hono()
  .route('/editor', editor)
  .route('/board', board)
  .route('/workspace', workspace);
