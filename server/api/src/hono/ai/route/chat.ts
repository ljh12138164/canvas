import { Hono } from "hono";
import { stream } from "hono/streaming";
import { model } from "../../../server/ai";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const chat = new Hono()
  .post(
    "/chat",
    zValidator("json", z.object({ prompt: z.string() })),
    async (c) => {
      const { prompt } = c.req.valid("json");
      const result = await model.generateContent(prompt);
      console.log(result.response.text());
      return c.json({ result: result.response.text() });
    }
  )
  .post(
    "/answer",
    zValidator("json", z.object({ prompt: z.string() })),
    async (c) => {
      const { prompt } = c.req.valid("json");
      const result = await model.generateContent(prompt);
      return c.json({ result: result.response.text() });
    }
  )
  .post(
    "/stream",
    zValidator("json", z.object({ prompt: z.string() })),
    async (c) => {
      const { prompt } = c.req.valid("json");
      const result = await model.generateContentStream(prompt);
      return stream(c, async (stream) => {
        for await (const chunk of result.stream) {
          stream.write(chunk.text());
        }
      });
    }
  );
