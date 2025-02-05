import { Providers } from '@/app/_provide/providers';
import Main from './_components/home/Main';
import NavBar from './_components/home/Navbar';

export default async function Home() {
  return (
    <Providers>
      <div className="min-h-[100dvh]">
        {/* 导航栏 */}
        <NavBar />
        {/* 主要内容区 */}
        <Main />
      </div>
    </Providers>
  );
}
