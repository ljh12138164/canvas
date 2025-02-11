import UserData from '@/app/_components/Board/UserData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '用户信息修改/ljh-design',
  description: 'ljh-design用户信息修改',
  keywords: ['ljh-design', '用户信息修改', '用户面板'],
};

export default async function Home() {
  return (
    <main className="min-w-[380px] w-full h-full entry">
      <UserData />
    </main>
  );
}
