import { handle } from 'hono/vercel';
import app from '../src/hono';
export const config = {
  runtime: 'edge',
};

export default handle(app);
