import { Hono } from 'hono';
import { design } from './design';
import { jebt } from './jebt';
import { cors } from 'hono/cors';
import { note } from './note';
import { form } from './form';
import { ai } from './ai';

// 跨域
const app = new Hono()
  .use(
    cors({
      origin: '*',
      credentials: true,
    })
  )
  .basePath('/api')
  .route('/design', design)
  .route('/jebt', jebt)
  .route('/note', note)
  .route('/form', form)
  .route('/ai', ai);

export type App = typeof app;
export default app;
