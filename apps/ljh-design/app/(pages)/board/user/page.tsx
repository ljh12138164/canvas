'use client';
import UserInfo from '@/app/_components/UserData/UserInfo';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const router = useRouter();
  const { user, loading } = useUser({ redirects: true });
  if (loading) return <></>;
  if (!user) {
    router.push('/sign-in');
    return <></>;
  }
  return (
    <ScrollArea className="p-6 h-[calc(100dvh-100px)]">
      <UserInfo />
    </ScrollArea>
  );
}
