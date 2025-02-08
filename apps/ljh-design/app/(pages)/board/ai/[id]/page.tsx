import AiContent from '@/app/_components/Ai/AiContent';

const AI = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AiContent id={id} />;
};

export default AI;
