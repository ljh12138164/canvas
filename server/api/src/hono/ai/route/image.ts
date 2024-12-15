import { Hono } from 'hono';
import { model } from '../../../server/ai';
import { InlineDataPart, TextPart } from '@google/generative-ai';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

/**
 * 使用谷歌ai多模态输入
 * 读取图片
 */
export const image = new Hono()
  .post(
    '/image',
    zValidator(
      'json',
      z.object({
        image: z.string(),
        prompt: z.string().optional(),
        filetype: z.string(),
      })
    ),
    async (c) => {
      const { image, prompt, filetype } = c.req.valid('json');
      // image为图片连接
      const imageResp = await fetch(image as string).then((response) => {
        return response.arrayBuffer();
      });
      console.log(imageResp);
      const result = await model.generateContent([
        {
          inlineData: {
            data: Buffer.from(imageResp).toString('base64'),
            mimeType: filetype as string,
          },
        },
        (prompt as string) || '解释这张图片',
      ]);
      return c.json({ result: result.response.text() });
    }
  )
  .post('/file', async (c) => {
    const body = await c.req.parseBody();

    const { image, prompt, filetype } = body;
    // 清理base64字符串
    const cleanBase64 = (image as string).replace(/[^A-Za-z0-9+/=]/g, '');
    // 将base64字符串转换为ArrayBuffer
    const fileBuffer = Uint8Array.from(atob(cleanBase64), (c) =>
      c.charCodeAt(0)
    ).buffer;
    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(fileBuffer).toString('base64'),
          mimeType: filetype as string,
        },
      },
      (prompt as string) || '解释这张图片',
    ]);
    return c.json({ result: result.response.text() });
  });
