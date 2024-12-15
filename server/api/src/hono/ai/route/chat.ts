import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { model } from '../../../server/ai';

// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

export const chat = new Hono()
  .post('/chat', async (c) => {
    const prompt = '说说ai的原理';
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return c.json({ result: result.response.text() });
  })
  .post('/answer', async (c) => {
    const { prompt } = (await c.req.json()) as { prompt: string };
    const result = await model.generateContent(prompt);
    return c.json({ result: result.response.text() });
  })
  .post('/stream', async (c) => {
    const { prompt } = (await c.req.json()) as { prompt: string };
    const result = await model.generateContentStream(prompt);
    return stream(c, async (stream) => {
      for await (const chunk of result.stream) {
        stream.write(chunk.text());
      }
    });
  });
