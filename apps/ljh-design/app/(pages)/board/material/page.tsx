import type { Metadata } from 'next';

import MaterialPage from '@/app/_components/Material/MaterialPage';

export const metadata: Metadata = {
  title: '素材中心/ljh-design',
  description: 'ljh-design素材中心',
  keywords: ['ljh-design', '素材', '素材中心'],
};
export default function Page() {
  return <MaterialPage />;
}
