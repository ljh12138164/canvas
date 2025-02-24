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
  // return (
  //   <div className="grid grid-cols-[200px_1fr] h-[calc(100vh-100px)] w-full">
  //     <FridenSider />
  //     {/* chatMain */}
  //   </div>
  // );
  return (
    <main className="h-[calc(100dvh-100px)] w-full relative bg-amber-100">
      <SidebarProvider>
        <AppSidebar className="absolute top-0 left-0 h-[calc(100dvh-100px)]" />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </main>
  );
}
