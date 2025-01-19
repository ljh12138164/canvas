import { Hono } from "hono";
import { model } from "../../../server/ai";
// import { InlineDataPart, TextPart } from "@google/generative-ai";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { stream } from "hono/streaming";
import {
  ChatSession,
  GenerateContentStreamResult,
} from "@google/generative-ai";

/**
 * 使用谷歌ai多模态输入
 * 读取图片
 */
export const image = new Hono()
  // 图片链接
  .post(
    "/image",
    zValidator(
      "json",
      z.object({
        image: z.string(),
        prompt: z.string().optional(),
        filetype: z.string(),
      })
    ),
    async (c) => {
      const { image, prompt, filetype } = c.req.valid("json");
      // image为图片连接
      const imageResp = await fetch(image as string).then((response) => {
        return response.arrayBuffer();
      });
      const result = await model.generateContent([
        {
          inlineData: {
            data: Buffer.from(imageResp).toString("base64"),
            mimeType: filetype as string,
          },
        },
        (prompt as string) || "解释这张图片",
      ]);
      return c.json({ result: result.response.text() });
    }
  )
  .post(
    "/imageStream",
    zValidator(
      "json",
      z.object({
        image: z.string(),
        prompt: z.string().optional(),
        filetype: z.string(),
      })
    ),
    async (c) => {
      const { image, prompt, filetype } = c.req.valid("json");
      // image为图片连接
      const imageResp = await fetch(image as string).then((response) => {
        return response.arrayBuffer();
      });
      const result = await model.generateContentStream([
        {
          inlineData: {
            data: Buffer.from(imageResp).toString("base64"),
            mimeType: filetype as string,
          },
        },
        (prompt as string) || "解释这张图片",
      ]);
      return stream(c, async (stream) => {
        for await (const chunk of result.stream) {
          stream.write(chunk.text());
        }
      });
    }
  )
  // file 为文件流
  .post(
    "/file",
    zValidator(
      "form",
      z.object({
        image: z.instanceof(File),
        prompt: z.string().optional(),
      })
    ),
    async (c) => {
      const { image, prompt } = c.req.valid("form");

      // 将base64字符串转换为ArrayBuffer
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      const result = await model.generateContent([
        {
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType: image.type,
          },
        },
        (prompt as string) || "解释这张图片",
      ]);
      return c.json({ result: result.response.text() });
    }
  )
  // 流式传输
  .post(
    "/fileStream",
    zValidator(
      "form",
      z.object({
        image: z.instanceof(File),
        prompt: z.string().optional(),
        history: z.string().optional(),
      })
    ),
    async (c) => {
      const { image, prompt, history } = c.req.valid("form");

      let chats: ChatSession | undefined;
      // 流式传输
      let streams: GenerateContentStreamResult;
      if (history && history.length > 0) {
        // 上下文设置
        chats = model.startChat({
          history: JSON.parse(history),
        });
      }
      // 将base64字符串转换为ArrayBuffer
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      // 检查上下文
      if (chats)
        streams = await chats.sendMessageStream([
          {
            inlineData: {
              data: fileBuffer.toString("base64"),
              mimeType: image.type,
            },
          },
          (prompt as string) || "解释这张图片",
        ]);
      else
        streams = await model?.generateContentStream([
          {
            inlineData: {
              data: fileBuffer.toString("base64"),
              mimeType: image.type,
            },
          },
          (prompt as string) || "解释这张图片",
        ]);
      // 返回流式传输
      return stream(c, async (stream) => {
        for await (const chunk of streams.stream) {
          stream.write(chunk.text());
        }
      });
    }
  );
