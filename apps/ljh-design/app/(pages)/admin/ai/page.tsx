import AiPage from '@/app/_components/admin/AiPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI统计/ljh-design',
  description: 'ljh-designAI统计',
  keywords: ['ljh-design', 'AI统计', 'AI'],
};
const Page = () => {
  return <AiPage />;
};

export default Page;
