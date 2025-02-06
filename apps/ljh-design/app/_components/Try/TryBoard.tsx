'use client';

import useUsers from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import TryMain from './TryMain';

const TryBoard = () => {
  const { user, loading } = useUsers({ redirects: false });
  const router = useRouter();
  if (loading) return <Skeleton className="h-screen w-full" />;

  if (!user) return <TryMain />;

  router.push('/board');
  return <></>;
};

export default TryBoard;
