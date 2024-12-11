import { Hono } from 'hono';
import { design } from './src/hono/design';
import { jebt } from './src/hono/jebt';
import { serve } from '@hono/node-server';
import { note } from './src/hono/note';
import { cors } from 'hono/cors';
import { stream } from 'hono/streaming';
import ZhipuAI from 'zhipuai-sdk-nodejs-v4';
import { IncomingMessage } from 'http';

const ai = new ZhipuAI({
  // 智谱AI的API密钥 901990b9c3b253eb71e20617aa2ee4cc.2pChbHlMynsuHd1M
  apiKey: '901990b9c3b253eb71e20617aa2ee4cc.2pChbHlMynsuHd1M',
});

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
  .get('/', (c) => {
    return c.json({ message: 'Hello World' });
  })
  .post('/chat', async (c) => {
    const prompt = '说说ai的原理';
    const data = await ai.createCompletions({
      // 模型
      model: 'glm-4V-flash',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });
    return c.json(data);
  })
  .post('/answer', async (c) => {
    const { prompt } = (await c.req.json()) as { prompt: string };
    const result = await ai.createCompletions({
      model: 'glm-4V-flash',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });
    return c.json(result);
  })
  .post('/stream', async (c) => {
    const { prompt } = (await c.req.json()) as { prompt: string };
    const result = (await ai.createCompletions({
      model: 'glm-4V-flash',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    })) as IncomingMessage;

    return stream(c, async (stream) => {
      for await (const chunk of result) {
        stream.write(chunk.toString());
      }
    });
  });

serve({
  fetch: app.fetch,
  port: 8000,
});
