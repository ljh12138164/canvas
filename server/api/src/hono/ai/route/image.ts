import { GoogleGenAI } from '@google/genai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { z } from 'zod';
import { model } from '../../../server/ai';

// 默认提示词
const DEFAULT_PROMPT = '请用专业的中文详细解释这张图片的内容，包括图片中的主要元素、场景、特点等。';
// const apiKey = process.env.GEMINI_API_KEY;

// 错误处理函数
const handleError = (c: any, error: any, message: string, statusCode = 500) => {
  console.error(`${message}:`, error);
  return c.json({ success: false, error: message }, statusCode);
};
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
      const { image: imageUrl, prompt, filetype } = c.req.valid('json');

      const [fetchErr, imageResp] = await to(
        fetch(imageUrl).then((response) => {
          if (!response.ok) throw new Error(`获取图片失败: ${response.statusText}`);
          return response.arrayBuffer();
        }),
      );

      if (fetchErr || !imageResp) return handleError(c, fetchErr, '无法获取图片资源');

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

      if (genErr || !result?.response) return handleError(c, genErr, 'AI生成内容失败');
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
      const { image: imageUrl, prompt, history } = c.req.valid('json');
      let filetype = '';
      const [fetchErr, imageResp] = await to(
        fetch(imageUrl).then((response) => {
          filetype = response.headers.get('Content-Type') || '';
          if (!response.ok) throw new Error(`获取图片失败: ${response.statusText}`);
          if (!filetype) throw new Error('无法确定图片类型');
          return response.arrayBuffer();
        }),
      );
      if (fetchErr || !imageResp) return handleError(c, fetchErr, '无法获取图片资源或类型');

      const historyList =
        history?.map((item) => ({
          role: item.role,
          parts: item.parts,
        })) ?? [];

      // 添加上下文
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
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
      // 转化图片
      const imageData = {
        inlineData: {
          data: Buffer.from(imageResp).toString('base64'),
          mimeType: filetype,
        },
      };
      // 获取流式结果
      const [streamErr, streamResult] = await to(
        chats.sendMessageStream([imageData, `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`]),
      );
      if (streamErr || !streamResult?.stream)
        return handleError(c, streamErr, 'AI生成流式内容失败');
      // 流式返回
      return stream(c, async (s) => {
        try {
          for await (const chunk of streamResult.stream) {
            if (chunk.candidates && chunk.candidates[0].finishReason === 'SAFETY') {
              await s.write('抱歉，由于安全原因，无法生成所请求的内容。');
              break;
            }
            await s.write(chunk.text());
          }
        } catch (error) {
          console.error('Error writing to stream:', error);
          try {
            await s.write('在处理流时发生错误。');
          } catch (writeError) {
            console.error('Error writing error message to stream:', writeError);
          }
        } finally {
          await s.close();
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
      if (!image.type) {
        return handleError(c, null, '无法确定上传文件的类型', 400);
      }
      const [bufferErr, fileBuffer] = await to(image.arrayBuffer());

      if (bufferErr || !fileBuffer) return handleError(c, bufferErr, '读取上传文件失败');

      const [genErr, result] = await to(
        model.generateContent([
          {
            inlineData: {
              data: Buffer.from(fileBuffer).toString('base64'),
              mimeType: image.type,
            },
          },
          `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`,
        ]),
      );

      if (genErr || !result?.response) return handleError(c, genErr, 'AI生成内容失败');
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
        history: z.preprocess(
          (val) => {
            try {
              return typeof val === 'string' ? JSON.parse(val) : val;
            } catch (e) {
              return undefined;
            }
          },
          z
            .array(
              z.object({
                role: z.enum(['user', 'model']),
                parts: z.array(z.object({ text: z.string() })),
              }),
            )
            .optional(),
        ),
      }),
    ),
    async (c) => {
      const { image, prompt, history } = c.req.valid('form');
      if (!image.type) {
        return handleError(c, null, '无法确定上传文件的类型', 400);
      }

      const [bufferErr, fileBuffer] = await to(image.arrayBuffer());
      if (bufferErr || !fileBuffer) return handleError(c, bufferErr, '读取上传文件失败');

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
          ...(history ?? []),
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      const imageData = {
        inlineData: {
          data: Buffer.from(fileBuffer).toString('base64'),
          mimeType: image.type,
        },
      };

      const [streamErr, streamResult] = await to(
        chats.sendMessageStream([imageData, `${prompt || DEFAULT_PROMPT}。请务必使用中文回答。`]),
      );

      if (streamErr || !streamResult?.stream)
        return handleError(c, streamErr, 'AI生成流式内容失败');

      return stream(c, async (s) => {
        try {
          for await (const chunk of streamResult.stream) {
            if (chunk.candidates && chunk.candidates[0].finishReason === 'SAFETY') {
              await s.write('抱歉，由于安全原因，无法生成所请求的内容。');
              break;
            }
            await s.write(chunk.text());
          }
        } catch (error) {
          console.error('Error writing to stream:', error);
          try {
            await s.write('在处理流时发生错误。');
          } catch (writeError) {
            console.error('Error writing error message to stream:', writeError);
          }
        } finally {
          await s.close();
        }
      });
    },
  )
  // --- AI 图像生成 ---
  .post(
    '/generateImage',
    zValidator(
      'json',
      z.object({
        prompt: z.string().min(1, '请提供有效的图片描述'),
      }),
    ),
    async (c) => {
      const { prompt } = c.req.valid('json');

      // 调用 Google AI API
      const [genErr, response] = await to(
        ai.models.generateContent({
          model: 'gemini-2.0-flash-exp-image-generation',
          contents: prompt,
          config: {
            responseModalities: ['Text', 'Image'],
          },
        }),
      );
      if (genErr) return handleError(c, null, '调用失败', 500);
      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data!;
            // 返回图片
            return c.json({
              success: true,
              data: {
                imageBase64: `data:image/png;base64,${imageData}`,
              },
            });
          }
        }
      }
    },
  );
