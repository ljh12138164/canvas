'use client';
import SiderBar from '@/components/Board/SiderBar';
import NavBar from '@/components/Board/Navbar';
import BoardMain from '@/components/Board/BoardMain';
import LoginProtect, { useUserId } from '../Sign/LoginProtect';
const Board = () => {
  const { userId, isLoading } = useUserId();
  return (
    <>
      <LoginProtect>
        {isLoading && (
          <div className='bg-muted h-[100vh] '>
            <SiderBar />
            <div className='lg:pl-[300px] flex flex-col h-full'>
              <NavBar />
              <main
                className='px-2 py-4 bg-white flex-1 min-w-[380px] overflow-hidden'
                style={{
                  scrollbarWidth: 'none',
                }}
              >
                <BoardMain userId={userId}></BoardMain>
              </main>
            </div>
          </div>
        )}
      </LoginProtect>
    </>
  );
};

export default Board;
