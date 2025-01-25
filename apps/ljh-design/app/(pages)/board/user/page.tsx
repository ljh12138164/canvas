'use client';
import UserInfo from '@/app/_components/UserData/UserInfo';
import useUser from '@/app/_hook/useUser';
import { redirect } from 'next/navigation';

export default function UserProfilePage() {
  const { user, loading } = useUser({ redirects: true });
  if (loading) return;
  if (!user) redirect('/sign-in');
  return (
    <div className="p-6">
      <UserInfo />
    </div>
  );
}
