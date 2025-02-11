import UserPage from '@/app/_components/admin/UserPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '用户统计/ljh-design',
  description: 'ljh-design用户统计',
  keywords: ['ljh-design', '用户统计', '用户面板'],
};
const Page = () => {
  return <UserPage />;
};

export default Page;
