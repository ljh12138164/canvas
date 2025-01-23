import { inter, myFont } from '@/app/_lib/font';

import { ShowPage } from '@/app/_components/Formue/ShowPage';
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
    <div className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden entry`}>
      <Providers>
        <ShowPage id={id} />
      </Providers>
    </div>
  );
}
