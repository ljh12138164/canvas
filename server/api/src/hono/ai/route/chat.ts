import type { GenerateContentStreamResult } from '@google/generative-ai';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { z } from 'zod/lib';
import { model } from '../../../server/ai';

export const chat = new Hono()
  // 非流式上下文
  .post('/answer', zValidator('json', z.object({ prompt: z.string() })), async (c) => {
    const { prompt } = c.req.valid('json');
    const systemPrompt = `你是一个专业的AI助手。请始终使用中文回答用户的问题。\n\n用户问题：${prompt}`;
    const result = await model.generateContent(systemPrompt);
    return c.json({ result: result.response.text() });
  })
  // 流式传输
  .post('/chat', zValidator('json', z.object({ prompt: z.string() })), async (c) => {
    const { prompt } = c.req.valid('json');
    const systemPrompt = `你是一个专业的AI助手。请始终使用中文回答用户的问题。\n\n用户问题：${prompt}`;
    const result = await model.generateContentStream(systemPrompt);
    return stream(c, async (stream) => {
      for await (const chunk of result.stream) {
        stream.write(chunk.text());
      }
    });
  })
  // 流式上下文, 有上下文
  .post(
    '/stream',
    zValidator(
      'json',
      z.object({
        prompt: z.string().min(1, '提示词不能为空'),
        history: z
          .array(
            z.object({
              role: z.enum(['user', 'model']),
              parts: z.array(z.object({ text: z.string() })),
            }),
          )
          .optional(),
      }),
    ),
    async (c) => {
      const { prompt, history } = c.req.valid('json');
      let streams: GenerateContentStreamResult;
      const historyList =
        history?.map((item) => {
          return {
            role: item.role,
            parts: item.parts,
          };
        }) ?? [];
      // 添加系统提示到聊天配置
      const chats = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: '你是一个专业的AI助手，你会始终使用中文回答你的问题。' }],
          },
          {
            role: 'model',
            parts: [{ text: '我是一个专业的AI助手，我会始终使用中文回答你的问题。' }],
          },
          ...historyList,
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        },
      });
      // 流式传输
      if (chats) streams = await chats.sendMessageStream(prompt);
      return stream(c, async (stream) => {
        for await (const chunk of streams.stream) {
          stream.write(chunk.text());
        }
      });
    },
  );
