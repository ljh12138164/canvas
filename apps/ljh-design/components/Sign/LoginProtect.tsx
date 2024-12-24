'use client';
import { useUser } from '@/store/auth';
import { redirect } from 'next/navigation';

export default function LoginProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  if (loading) return;
  if (!user) redirect('/board/sign-in');
  return children;
}
