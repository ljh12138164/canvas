'use client';
import MaterialMain from '@/app/_components/Material/MaterialMain';
import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: '素材中心/ljh-design',
//   description: 'ljh-design素材中心',
//   keywords: ['ljh-design', '素材', '素材中心'],
// };
export default function MaterialPage() {
  const { user, loading } = useUser({ redirects: true });
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
      return;
    }
  }, [user, loading]);
  if (loading) return <></>;
  if (!user) return <></>;
  return <MaterialMain />;
}
