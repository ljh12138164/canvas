import { ShowPage } from '@/app/_components/Formue/ShowPage';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { Providers } from '@/app/_provide/providers';

export default async function Home({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  return (
    <ScrollArea className="h-[calc(100dvh-100px)] flex flex-col overflow-hidden entry gap-4">
      <Providers>
        <ShowPage id={id} />
      </Providers>
    </ScrollArea>
  );
}
