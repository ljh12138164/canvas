import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import app from '../hono';
// import { chat } from './ai/chat';

const apps = new OpenAPIHono(app);

// ai
// app.openapi(createRoute(chat));

apps.get(
  '/ui',
  swaggerUI({
    url: '/doc',
  }),
);

apps.doc('/doc', {
  info: {
    title: 'An API',
    version: 'v1',
  },
  openapi: '3.1.0',
});

serve({
  fetch: apps.fetch,
  port: 2222,
});
