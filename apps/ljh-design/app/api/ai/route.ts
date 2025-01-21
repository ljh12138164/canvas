import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // 这里添加实际的AI处理逻辑
    // 示例：简单的回复
    const aiResponse = `收到你的消息：${message}`;

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
}
