'use client';
import MaterialMain from '@/app/_components/Material/MaterialMain';
import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function MaterialPage() {
  const { user, loading } = useUser({ redirects: true });
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
      return;
    }
  }, [user, loading]);
  if (loading) return;
  if (!user) return;
  return <MaterialMain />;
}
