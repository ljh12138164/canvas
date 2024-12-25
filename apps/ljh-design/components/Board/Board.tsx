'use client';
import BoardMain from '@/components/Board/BoardMain';
import useUser from '@/hook/useUser';
import { redirect } from 'next/navigation';
const Board = () => {
  const { user, loading } = useUser();
  if (loading) return;
  if (!user) redirect('/sign-in');
  return <BoardMain token={user.session.access_token}></BoardMain>;
};

export default Board;
