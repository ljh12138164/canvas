import app from './src/hono';
import { serve } from '@hono/node-server';

serve({
  fetch: app.fetch,
  port: 8000,
});
