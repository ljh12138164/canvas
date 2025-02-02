import { Hono } from 'hono';
import { checkToken } from '../../libs/middle';
import board from './route/board';
import { chat } from './route/chat';
import { flow } from './route/flow';
import project from './route/project';
import { storage } from './route/stoage';
import task from './route/task';
import user from './route/user';
export const jebt = new Hono()
  .use(checkToken(process.env.SUPABASE_JEBT_JWT!))
  .route('/board', board)
  .route('/user', user)
  .route('/project', project)
  .route('/task', task)
  .route('/chat', chat)
  .route('/storage', storage)
  .route('/flow', flow);
