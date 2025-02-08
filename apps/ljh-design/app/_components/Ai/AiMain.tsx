'use client';

import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import AiList from './AiList';

export default function AiMain() {
  const router = useRouter();
  const { user, loading } = useUser({ redirects: true });
  if (loading) return <></>;
  if (!user) router.push('/sign-in');

  return <AiList />;
}
