'use client';
import TemplateMain from '@/app/_components/template/TemplateMain';
import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function TemplatePage() {
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
  return <TemplateMain userId={user.user.id} />;
}
