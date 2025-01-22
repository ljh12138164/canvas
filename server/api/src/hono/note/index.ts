import { Hono } from 'hono';
import { collaborators } from './route/collaborators';
import { editor } from './route/editor';
import { file } from './route/file';
import { folder } from './route/folder';
import { webhook } from './route/webhook';
import { workspace } from './route/workspace';

export const note = new Hono()
  .route('/editor', editor)
  .route('/folder', folder)
  .route('/workspace', workspace)
  .route('/webhook', webhook)
  .route('/collaborators', collaborators)
  .route('/file', file);
