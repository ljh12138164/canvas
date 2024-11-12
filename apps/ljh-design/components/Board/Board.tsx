"use client";
import BoardMain from "@/components/Board/BoardMain";
import NavBar from "@/components/Board/Navbar";
import SiderBar from "@/components/Board/SiderBar";
import useUser from "@/hook/useUser";
const Board = () => {
  const { userId, isLoading } = useUser();
  return (
    <>
      {!isLoading && userId && (
        <div className="bg-muted h-[100vh] ">
          <SiderBar />
          <div className="lg:pl-[300px] flex flex-col h-full">
            <NavBar />
            <main
              className="px-2 py-4 bg-white flex-1 min-w-[380px] overflow-hidden"
              style={{
                scrollbarWidth: "none",
              }}
            >
              <BoardMain userId={userId}></BoardMain>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
