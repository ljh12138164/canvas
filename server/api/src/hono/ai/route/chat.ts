import { Hono } from "hono";
import { stream } from "hono/streaming";
import { model } from "../../../server/ai";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const chat = new Hono()
  // 非流式上下文
  .post(
    "/answer",
    zValidator("json", z.object({ prompt: z.string() })),
    async (c) => {
      const { prompt } = c.req.valid("json");
      const result = await model.generateContent(prompt);
      return c.json({ result: result.response.text() });
    }
  )
  // 流式传输
  .post(
    "/chat",
    zValidator("json", z.object({ prompt: z.string() })),
    async (c) => {
      const { prompt } = c.req.valid("json");
      // 设置上下文
      const result = await model.generateContentStream(prompt);
      return stream(c, async (stream) => {
        for await (const chunk of result.stream) {
          stream.write(chunk.text());
        }
      });
    }
  )
  // 流式上下文
  .post(
    "/stream",
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "model"]),
              parts: z.array(z.object({ text: z.string() })),
            })
          )
          .optional(),
      })
    ),
    async (c) => {
      const { prompt, history } = c.req.valid("json");
      let chats;
      let streams;
      if (history && history.length > 0) {
        // 上下文设置
        chats = model.startChat({
          history,
        });
      }
      // 流式传输
      if (chats) streams = await chats.sendMessageStream(prompt);
      else streams = await model?.generateContentStream(prompt);

      return stream(c, async (stream) => {
        for await (const chunk of streams.stream) {
          stream.write(chunk.text());
        }
      });
    }
  );
