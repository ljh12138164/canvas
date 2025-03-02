import { GoogleGenerativeAI } from '@google/generative-ai';

const training_data = [
  {
    role: 'user',
    parts: [{ text: '回答的时候说中文' }],
  },
];
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// 谷歌可以的模型有 gemini-1.5-flash gemini-1.5-flash-8b gemini-2.0-flash-exp（实验性的模型，后面可能会有文生图）
const model = genAi.getGenerativeModel({
  model: 'gemini-2.0-flash',
  cachedContent: { contents: training_data },
});

export { model };
