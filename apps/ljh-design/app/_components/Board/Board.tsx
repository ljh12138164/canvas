'use client';
import BoardMain from '@/app/_components/Board/BoardMain';
import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
const Board = () => {
  const { user, loading } = useUser({ redirects: true });
  const router = useRouter();
  if (loading) return;
  if (!user) return router.push('/sign-in');
  return <BoardMain userId={user.user.id} />;
};

export default Board;
