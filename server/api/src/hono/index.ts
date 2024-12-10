import { Hono } from 'hono';
import { design } from './design';
import { jebt } from './jebt';
import { cors } from 'hono/cors';
import { note } from './note';
import { form } from './form';
import { ai } from './gemini';
// import { hc } from 'hono/client';

// import { emails } from "./email";
// import * as React from 'react';

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
// .route('/email', emails);

export type App = typeof app;
export default app;

// export const client = hc<App>('http://localhost:8000').api.;
