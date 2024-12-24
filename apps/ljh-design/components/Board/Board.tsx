'use client';
import BoardMain from '@/components/Board/BoardMain';
import useUser from '@/hook/useUser';
import { redirect } from 'next/navigation';
const Board = () => {
  const { user, loading } = useUser();
  console.log(user);
  if (loading) return;
  if (!user) redirect('/board/sign-in');
  return <BoardMain userId={user?.user.id}></BoardMain>;
};

export default Board;
