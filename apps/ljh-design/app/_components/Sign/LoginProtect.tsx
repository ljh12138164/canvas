'use client';
import { useUser } from '@/app/_store/auth';
import { useRouter } from 'next/navigation';

export default function LoginProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  if (loading) return;
  if (!user) router.push('/sign-in');
  return children;
}
