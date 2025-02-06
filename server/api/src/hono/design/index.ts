import { Hono } from 'hono';
import { answers } from './route/answers';
import board from './route/board';
import { collections } from './route/collections';
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
  .route('/material', material);
