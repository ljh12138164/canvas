'use client';
import TemplateMain from '@/app/_components/template/TemplateMain';
import useUser from '@/app/_hook/useUser';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
export default function TemplatePage() {
  const { user, loading } = useUser({ redirects: true });
  useEffect(() => {
    if (!loading && !user) {
      redirect('/sign-in');
    }
  }, [user, loading]);
  if (loading) return;
  if (!user) return;
  return <TemplateMain userId={user.user.id} />;
}
