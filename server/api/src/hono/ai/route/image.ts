import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { z } from 'zod/lib';
import { model } from '../../../server/ai';

// 默认提示词
const DEFAULT_PROMPT = '请用专业的中文详细解释这张图片的内容，包括图片中的主要元素、场景、特点等。';

// 错误处理函数
const handleError = (error: any) => {
  console.error('AI处理错误:', error);
  return { error: true, message: '处理图片时发生错误，请稍后重试' };
};

/**
 * 使用谷歌ai多模态输入
 * 读取图片
 */
export const image = new Hono()
  // 图片链接
  .post(
    '/image',
    zValidator(
      'json',
      z.object({
        image: z.string().url('请提供有效的图片URL'),
        prompt: z.string().optional(),
        filetype: z.string(),
      }),
    ),
    async (c) => {
      const { image, prompt, filetype } = c.req.valid('json');

      const [fetchErr, imageResp] = await to(
        fetch(image).then((response) => {
          if (!response.ok) throw new Error('获取图片失败');
          return response.arrayBuffer();
        }),
      );

      if (fetchErr) return c.json(handleError(fetchErr), 500);

      const [genErr, result] = await to(
        model.generateContent([
          {
            inlineData: {
              data: Buffer.from(imageResp).toString('base64'),
              mimeType: filetype,
            },
          },
          `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`,
        ]),
      );

      if (genErr) return c.json(handleError(genErr), 500);
      return c.json({ success: true, result: result.response.text() });
    },
  )
  // 流式传输---图片链接
  .post(
    '/imageStream',
    zValidator(
      'json',
      z.object({
        image: z.string().url('请提供有效的图片URL'),
        prompt: z.string().optional(),
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
      const { image, prompt, history } = c.req.valid('json');
      let filetype = '';
      const [fetchErr, imageResp] = await to(
        fetch(image).then((response) => {
          filetype = response.headers.get('Content-Type') || '';
          if (!response.ok) throw new Error('获取图片失败');
          return response.arrayBuffer();
        }),
      );
      if (fetchErr) return c.json(handleError(fetchErr), 500);
      const historyList =
        history?.map((item) => {
          return {
            role: item.role,
            parts: item.parts,
          };
        }) ?? [];
      // 创建聊天
      const chats = model.startChat({
        history: [
          {
            role: 'user',
            parts: [
              {
                text: '你是一个专业的AI助手，你会始终使用中文回答你的问题，并专业地分析图片内容。',
              },
            ],
          },
          {
            role: 'model',
            parts: [
              {
                text: '我是一个专业的AI助手，我会始终使用中文回答你的问题，并专业地分析图片内容。',
              },
            ],
          },
          ...historyList,
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        },
      });
      const imageData = {
        inlineData: {
          data: Buffer.from(imageResp).toString('base64'),
          mimeType: filetype,
        },
      };
      const [streamErr, streamResult] = await to(
        chats.sendMessageStream([imageData, `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`]),
      );
      if (streamErr) return c.json(handleError(streamErr), 500);
      return stream(c, async (stream) => {
        for await (const chunk of streamResult.stream) {
          stream.write(chunk.text());
        }
      });
    },
  )
  // file 为文件流
  .post(
    '/file',
    zValidator(
      'form',
      z.object({
        image: z.instanceof(File),
        prompt: z.string().optional(),
      }),
    ),
    async (c) => {
      const { image, prompt } = c.req.valid('form');
      const fileBuffer = Buffer.from(await image.arrayBuffer());

      const [genErr, result] = await to(
        model.generateContent([
          {
            inlineData: {
              data: fileBuffer.toString('base64'),
              mimeType: image.type,
            },
          },
          `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`,
        ]),
      );

      if (genErr) return c.json(handleError(genErr), 500);
      return c.json({ success: true, result: result.response.text() });
    },
  )
  // 流式传输---文件流
  .post(
    '/fileStream',
    zValidator(
      'form',
      z.object({
        image: z.instanceof(File),
        prompt: z.string().optional(),
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
      const { image, prompt, history } = c.req.valid('form');

      const chats = model.startChat({
        history: [
          {
            role: 'model',
            parts: [
              {
                text: '我是一个专业的AI助手，我会始终使用中文回答你的问题，并专业地分析图片内容。',
              },
            ],
          },
          ...(history ?? []),
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        },
      });

      const fileBuffer = Buffer.from(await image.arrayBuffer());
      const imageData = {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: image.type,
        },
      };

      const [streamErr, streamResult] = await to(
        chats
          ? chats.sendMessageStream([
              imageData,
              `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`,
            ])
          : model.generateContentStream([
              imageData,
              `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`,
            ]),
      );

      if (streamErr) return c.json(handleError(streamErr), 500);

      return stream(c, async (stream) => {
        for await (const chunk of streamResult.stream) {
          stream.write(chunk.text());
        }
      });
    },
  );
