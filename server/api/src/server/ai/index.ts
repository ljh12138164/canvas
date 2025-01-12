import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// 谷歌可以的模型有 gemini-1.5-flash gemini-1.5-flash-8b gemini-2.0-flash-exp（实验性的模型，后面可能会有文生图）
const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
// 图片生成模型
export { model };
