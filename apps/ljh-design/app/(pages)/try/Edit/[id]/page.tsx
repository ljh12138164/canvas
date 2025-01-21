import TryCanvas from '@/app/_components/Try/TryCanvas';
import { inter, myFont } from '@/app/_lib/font';
import { Providers } from '@/app/_provide/providers';

type Params = Promise<{
  id: string;
}>;
export default async function Home({ params }: { params: Params }) {
  const { id } = await params;
  return (
    <section className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden`}>
      <Providers>
        <TryCanvas id={id} />
      </Providers>
    </section>
  );
}
