import AiContent from '@/app/_components/Ai/AiContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI助手/ljh-design',
  description: 'ljh-designAI助手',
  keywords: ['ljh-design', 'AI助手', 'AI'],
};
const AI = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AiContent id={id} />;
};

export default AI;
