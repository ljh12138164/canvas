import FormueMain from '@/app/_components/Formue/FormueMain';
import { Providers } from '@/app/_provide/providers';

export default async function Home() {
  return (
    <main className="entry">
      <Providers>
        <FormueMain />
      </Providers>
    </main>
  );
}
