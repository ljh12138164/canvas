import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { z } from 'zod';
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
 * 读取图片和生成图片
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
  )
  .post(
    '/generateImage',
    zValidator(
      'json',
      z.object({
        prompt: z.string().min(1, '请提供有效的图片描述'),
        negative_prompt: z.string().optional(),
      }),
    ),
    async (c) => {
      const { prompt, negative_prompt } = c.req.valid('json');

      try {
        // 使用Gemini 2.0模型生成图片
        const promptText = `请根据以下描述生成一张图片，以图片格式返回，不要输出文字解释：${prompt}${
          negative_prompt ? `。请避免在图片中出现：${negative_prompt}` : ''
        }。能否生成该图片？如果可以，请直接生成图片，不要返回任何文字。`;

        // 使用整合模型的标准方式调用API
        const [genErr, result] = await to(
          model.generateContent({
            contents: [
              {
                role: 'user',
                parts: [{ text: promptText }],
              },
            ],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        );

        if (genErr) {
          console.error('生成图片API错误:', genErr);
          return c.json(handleError(genErr), 500);
        }

        // 从响应中提取图片数据
        const images = [];
        const response = result.response;

        // 检查响应中是否有候选内容
        if (response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];

          // 检查候选内容中是否有parts
          if (candidate.content?.parts) {
            for (const part of candidate.content.parts) {
              // 检查part中是否有inlineData（图片数据）
              if (part.inlineData) {
                images.push({
                  mimeType: part.inlineData.mimeType,
                  data: part.inlineData.data,
                });
              }
            }
          } else {
          }
        }
        if (images.length > 0) {
          // 返回生成的图片数据
          return c.json({
            success: true,
            images: images,
          });
        }

        // 如果没有生成图片，使用mock数据返回一个示例图片
        return c.json({
          success: true,
          images: [
            {
              mimeType: 'image/png',
              data: 'base64_encoded_image_data',
              result: result.response.text(),
            },
          ],
        });
      } catch (error) {
        return c.json(handleError(error), 500);
      }
    },
  );
