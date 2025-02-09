import TryEdit from '@/app/_components/EditComponents/editor/TryEdit';
import { Providers } from '@/app/_provide/providers';
type Params = Promise<{
  id: string;
}>;
export default async function Home({ params }: { params: Params }) {
  const { id } = await params;
  return (
    <section className="h-[100dvh] overflow-hidden">
      <Providers>
        <TryEdit id={id} />
      </Providers>
    </section>
  );
}
