'use client';
import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import Edit from './Edit';

const EditMain = ({ id, type }: { id?: string; type: 'template' | 'board' | 'material' }) => {
  const { user, loading } = useUser({ redirects: true });
  const router = useRouter();
  if (loading) return <></>;
  if (!user) router.push('/sign-in');
  return <Edit id={id} user={user!} type={type} />;
};

export default EditMain;
