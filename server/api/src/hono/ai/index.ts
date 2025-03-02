import { Hono } from 'hono';

import { chat } from './route/chat';
import { design } from './route/design';
import { image } from './route/image';

export const ai = new Hono()
  .get('/', (c) => {
    return c.json({ message: 'Hello World' });
  })
  .route('/chat', chat)
  .route('/image', image)
  .route('/design', design);
