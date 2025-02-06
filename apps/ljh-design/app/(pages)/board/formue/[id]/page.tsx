import { ShowPage } from '@/app/_components/Formue/ShowPage';
import { ScrollArea } from '@/app/_components/ui/scroll-area';

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
