'use client';
import { useUser } from '@/store/auth';
import { redirect } from 'next/navigation';
import Edit from './Edit';

const EditMain = ({ id }: { id: string }) => {
  const { user, loading } = useUser();
  if (loading) return;
  if (!user) redirect('/sign-in');
  return <Edit token={user.session.access_token} id={id} />;
};

export default EditMain;
