import { ShowPage } from '@/app/_components/Formue/ShowPage';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '设计详情/ljh-design',
  description: 'ljh-design设计详情',
  keywords: ['ljh-design', '设计详情', '设计'],
};

export default async function Home({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  return (
    <section className="h-[calc(100dvh-100px)] overflow-y-auto ">
      <ScrollArea className="h-full p-4">
        <ShowPage id={id} />
      </ScrollArea>
    </section>
  );
}
