'use client';
import UserInfo from '@/app/_components/UserData/UserInfo';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import useUser from '@/app/_hook/useUser';
import { redirect } from 'next/navigation';

export default function UserProfilePage() {
  const { user, loading } = useUser({ redirects: true });
  if (loading) return;
  if (!user) redirect('/sign-in');
  return (
    <ScrollArea className=" p-6 h-[calc(100dvh-150px)]">
      <UserInfo />
    </ScrollArea>
  );
}
