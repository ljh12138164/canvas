import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { stream } from 'hono/streaming';
import ZhipuAI from 'zhipuai-sdk-nodejs-v4';
// import type { IncomingMessage } from 'http';
// 依赖 pnpm add  hono @hono/node-server zhipuai-sdk-nodejs-v4 @types/node
const ai = new ZhipuAI({
  // 智谱AI的API密钥
  apiKey: '',
});
// 跨域
const app = new Hono()
  .use(
    cors({
      origin: '*',
      credentials: true,
    }),
  )
  .basePath('/api')
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
  // 非流式
  .post('/answer', async (c) => {
    const { prompt } = (await c.req.json()) as { prompt: string };
    const result = await ai.createCompletions({
      model: 'glm-4V-flash',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });
    return c.json(result);
  })
  // 流式
  .post('/stream', async (c) => {
    const { prompt } = (await c.req.json()) as { prompt: string };
    const result = (await ai.createCompletions({
      model: 'glm-4V-flash',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    })) as any;

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
