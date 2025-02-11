import FormueMain from '@/app/_components/Formue/FormueMain';
import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '设计列表/ljh-design',
  description: 'ljh-design设计列表',
  keywords: ['ljh-design', '设计列表', '设计'],
};

export default async function Home() {
  return (
    <main className="entry">
      <Providers>
        <FormueMain />
      </Providers>
    </main>
  );
}
