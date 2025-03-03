import FridentHome from '@/app/_components/Friend/FridentHome';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '好友列表/ljh-design',
  description: 'ljh-design好友列表',
  keywords: ['ljh-design', '好友列表', '好友'],
};

export default async function Home() {
  return (
    <main className="entry">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <FridentHome />
      </div>
    </main>
  );
}
