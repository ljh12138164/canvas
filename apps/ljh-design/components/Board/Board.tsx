"use client";
import SiderBar from "@/components/Board/SiderBar";
import NavBar from "@/components/Board/Navbar";
import BoardMain from "@/components/Board/BoardMain";
const Board = ({ userId }: { userId: string }) => {
  return (
    <div className="bg-muted h-[100vh] ">
      <SiderBar />
      <div className="lg:pl-[300px] flex flex-col h-full">
        <NavBar userId={userId} />
        <main className="px-2 py-4 bg-white flex-1 min-w-[380px]">
          <BoardMain userId={userId}></BoardMain>
        </main>
      </div>
    </div>
  );
};

export default Board;
