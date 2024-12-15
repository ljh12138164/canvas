import { Hono } from 'hono';

import { chat } from './route/chat';
import { image } from './route/image';

export const ai = new Hono().route('/chat', chat).route('/image', image);
