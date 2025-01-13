'use client';
import BoardMain from '@/app/_components/Board/BoardMain';
import useUser from '@/app/_hook/useUser';
import { redirect } from 'next/navigation';
const Board = () => {
  const { user, loading } = useUser({ redirects: true });
  if (loading) return;
  if (!user) redirect('/sign-in');
  return <BoardMain userId={user.user.id}></BoardMain>;
};

export default Board;
