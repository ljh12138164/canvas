'use client';

import useUsers from '@/app/_hook/useUser';
import { redirect } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import TryMain from './TryMain';

const TryBoard = () => {
  const { user, loading } = useUsers({ redirects: false });
  if (loading) return <Skeleton className="h-screen w-full" />;

  if (!user) return <TryMain />;

  return redirect('/board');
};

export default TryBoard;
