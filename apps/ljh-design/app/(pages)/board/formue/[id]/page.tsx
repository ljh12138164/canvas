import { ShowPage } from '@/app/_components/Formue/ShowPage';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { client } from '@/app/_database';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await client.showPublic.get.$get({ query: { id } });
  if (!res.ok) {
    return {
      title: '设计详情/ljh-design',
      description: 'ljh-design设计详情',
      keywords: ['ljh-design', '设计详情', '设计'],
    } as const;
  }
  const show = await res.json();
  return {
    title: `设计详情/${show.title}`,
    description: `设计详情/${show.title}`,
    keywords: ['ljh-design', '设计详情', '设计'],
  } as const;
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
      <ScrollArea className="h-full p-4 pb-16">
        <ShowPage id={id} />
      </ScrollArea>
    </section>
  );
}
