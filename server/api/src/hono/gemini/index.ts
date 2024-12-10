import { Hono } from 'hono';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const ai = new Hono().post('/chat', async (c) => {
  console.log(process.env.GEMINI_API_KEY);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = 'Explain how AI works';

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return c.json({ result: result.response.text() });
});
