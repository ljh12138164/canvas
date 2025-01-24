import { Hono } from 'hono';
import board from './route/board';
import { collections } from './route/collections';
// import user from './route/user';
import image from './route/image';
import { show, showPublic } from './route/show';
import tap from './route/tap';
import { upvotes } from './route/upvote';
import { user } from './route/user';
import { webhooks } from './route/webhooks';

export const design = new Hono()
  .route('/showPublic', showPublic)
  .route('/image', image)
  .route('/board', board)
  .route('/show', show)
  .route('/tap', tap)
  .route('/webhook', webhooks)
  .route('/user', user)
  .route('/collection', collections)
  .route('/upvote', upvotes);
