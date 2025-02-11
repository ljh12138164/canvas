import ShowPage from '@/app/_components/admin/ShowPage';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '话题统计/ljh-design',
  description: 'ljh-design话题统计',
  keywords: ['ljh-design', '话题统计', '话题'],
};
const Page = () => {
  return <ShowPage />;
};

export default Page;
