'use client';
import { useIsAdmin } from '@/app/_hook/useAdmin';

export default function Home() {
  const { isLoading } = useIsAdmin({ type: 'logout' });
  if (isLoading) return <></>;
  return <div>Home</div>;
}
