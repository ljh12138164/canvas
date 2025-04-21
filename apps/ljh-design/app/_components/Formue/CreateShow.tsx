'use client';
import useUsers from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import Form from './Form';

const CreateShow = () => {
  const router = useRouter();
  const { user, loading } = useUsers({ redirects: true });
  if (loading) return <></>;
  if (!user) {
    router.push('/sign-in');
    return <></>;
  }

  return <Form userId={user!.user.id} />;
};

export default CreateShow;
