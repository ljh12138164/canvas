import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ai } from './ai';
import { design } from './design';
import { form } from './form';
import { jebt } from './jebt';
import { storage } from './jebt/route/stoage';
import { note } from './note';
// import { compress } from 'hono/compress';

// 跨域
const app = new Hono()
  .use(
    cors({
      origin: 'http://ljhboard.cn',
      credentials: true,
    }),
  )
  // .use(
  //   compress({
  //     encoding: 'gzip',
  //   })
  // )
  .basePath('/api')
  // 自动生成OpenAPI文档
  .route('/design', design)
  .route('/jebt', jebt)
  .route('/note', note)
  .route('/form', form)
  .route('/ai', ai)
  .route('/storage', storage);

export type App = typeof app;
export default app;
