"use client";
import SiderBar from "@/components/Board/SiderBar";
import NavBar from "@/components/Board/Navbar";
import BoardMain from "@/components/Board/BoardMain";
import { useUserQuery } from "@/api/useQuery/useUserQuery";
const Board = ({ userId }: { userId: string }) => {
  const userHook = useUserQuery(userId);

  return (
    <div className="bg-muted h-full">
      <SiderBar />
      <div className="lg:pl-[300px] flex flex-col h-full">
        <NavBar userHook={userHook} />
        <main className="px-2 py-4 bg-white">
          <BoardMain></BoardMain>
        </main>
      </div>
    </div>
  );
};

export default Board;
