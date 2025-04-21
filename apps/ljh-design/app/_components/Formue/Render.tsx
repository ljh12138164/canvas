'use client';
import { RenderEditor } from '../Comand/RiceEdit/RenderEdit';

// 渲染富文本和
export function Render({ content }: { content: string }) {
  return <RenderEditor content={content} />;
}
