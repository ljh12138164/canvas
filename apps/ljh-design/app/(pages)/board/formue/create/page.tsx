import CreateShow from '@/app/_components/Formue/CreateShow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '发布设计/ljh-design',
  description: 'ljh-design发布设计',
  keywords: ['ljh-design', '发布设计', '设计'],
};

const CreateShowPage = () => {
  return <CreateShow />;
};

export default CreateShowPage;
