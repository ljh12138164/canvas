import { Providers } from '@/app/_provide/providers';
import Main from './_components/home/Main';
import NavBar from './_components/home/Navbar';
import { ScrollArea } from './_components/ui/scroll-area';

export default async function Home() {
  // asd;
  return (
    <Providers>
      <ScrollArea className="h-[100dvh]">
        {/* 导航栏 */}
        <NavBar />
        {/* 主要内容区 */}
        <Main />
      </ScrollArea>
    </Providers>
  );
}
