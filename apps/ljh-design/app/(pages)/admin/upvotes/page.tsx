import UpvotesPage from '@/app/_components/admin/upvotesPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '点赞统计/ljh-design',
  description: 'ljh-design点赞统计',
  keywords: ['ljh-design', '点赞统计', '点赞'],
};
const Page = () => {
  return <UpvotesPage />;
};

export default Page;
