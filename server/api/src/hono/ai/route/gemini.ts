import { Hono } from 'hono';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { stream, streamText, streamSSE } from 'hono/streaming';

// import { zValidator } from '@hono/zod-validator';
// import { z } from 'zod';

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const gemini = new Hono()
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
