import UserDataMain from '@/app/_components/UserData/userDataMain';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '用户统计/ljh-design',
  description: 'ljh-design用户统计',
  keywords: ['ljh-design', '用户统计', '用户面板'],
};

export default async function Home() {
  return (
    <main className="min-w-[380px] w-full h-full entry">
      <UserDataMain />
    </main>
  );
}
