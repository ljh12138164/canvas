'use client';

import { AppSidebar } from '@/app/_components/Friend/sidebar';
import { SidebarInset, SidebarProvider } from '@/app/_components/ui/sidebar';
import useUsers from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export default function FriendMain({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useUsers({ redirects: true });
  if (loading) return <></>;
  if (!user) {
    router.push('/sign-in');
    return <></>;
  }

  return (
    <main className="h-[calc(100dvh-100px)] w-full relative bg-amber-100">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar className="absolute top-0 left-0 h-[calc(100dvh-100px)]" />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </main>
  );
}
