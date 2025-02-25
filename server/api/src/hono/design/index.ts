import { Hono } from 'hono';
import { admin } from './route/admin';
import { ai } from './route/ai';
import { answers } from './route/answers';
import board from './route/board';
import { chat } from './route/chat';
import { collections } from './route/collections';
import { friend } from './route/friend';
// import user from './route/user';
import image from './route/image';
import { material } from './route/material';
import { show, showPublic } from './route/show';
import tap from './route/tap';
import template from './route/template';
import { upvotes } from './route/upvote';
import { user } from './route/user';

export const design = new Hono()
  .route('/showPublic', showPublic)
  .route('/image', image)
  .route('/board', board)
  .route('/show', show)
  .route('/tap', tap)
  .route('/user', user)
  .route('/collection', collections)
  .route('/upvote', upvotes)
  .route('/template', template)
  .route('/answers', answers)
  .route('/material', material)
  .route('/ai', ai)
  .route('/friend', friend)
  .route('/admin', admin)
  .route('/chat', chat);
// .route('/clone', clone);
