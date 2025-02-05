// import { swaggerUI } from '@hono/swagger-ui';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ai } from './ai';
import { design } from './design';
import { form } from './form';
import { jebt } from './jebt';
import { storage } from './jebt/route/stoage';
import { note } from './note';

// 跨域
const app = new Hono()
  .use(
    cors({
      origin: '*',
      credentials: true,
    }),
  )
  .basePath('/api')
  .route('/design', design)
  .route('/jebt', jebt)
  .route('/note', note)
  .route('/form', form)
  .route('/ai', ai)
  .route('/storage', storage);

export type App = typeof app;
export default app;
