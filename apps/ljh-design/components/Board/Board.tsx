"use client";
import BoardMain from "@/components/Board/BoardMain";
import useUser from "@/hook/useUser";
const Board = () => {
  const { userId, isLoading: isLoadingUser } = useUser();
  if (isLoadingUser) return;
  return <BoardMain userId={userId}></BoardMain>;
};

export default Board;
