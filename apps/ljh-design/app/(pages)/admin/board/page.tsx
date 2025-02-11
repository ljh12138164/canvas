import BoardPage from '@/app/_components/admin/BoardPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '画布统计/ljh-design',
  description: 'ljh-design画布统计',
  keywords: ['ljh-design', '画布统计', '画布'],
};
const Page = () => {
  return <BoardPage />;
};

export default Page;
