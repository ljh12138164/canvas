import CollectionPage from '@/app/_components/admin/CollectionPage';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '收藏统计/ljh-design',
  description: 'ljh-design收藏统计',
  keywords: ['ljh-design', '收藏统计', '收藏'],
};
const Page = () => {
  return <CollectionPage />;
};

export default Page;
