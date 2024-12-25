'use client';

import useUsers from '@/hook/useUser';
import TryMain from './TryMain';
import { Skeleton } from '../ui/skeleton';
import { redirect } from 'next/navigation';

const TryBoard = () => {
  const { user, loading } = useUsers({ redirects: false });
  if (loading) return <Skeleton className='h-screen w-full' />;

  if (!user) return <TryMain></TryMain>;

  return redirect('/board');
};

export default TryBoard;
