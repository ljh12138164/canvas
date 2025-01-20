import { Hono } from 'hono';
// import user from './route/user';
import image from './route/image';
import board from './route/board';
import show from './route/show';
import tap from './route/tap';
import { webhooks } from './route/webhooks';
export const design = new Hono()
  // .route("/user", user)
  .route('/image', image)
  .route('/board', board)
  .route('/formue', show)
  .route('/tap', tap)
  .route('/webhook', webhooks);
