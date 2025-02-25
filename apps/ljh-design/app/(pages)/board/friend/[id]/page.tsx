import ChatMain from '@/app/_components/Friend/ChatMain';
import ChatState from '@/app/_components/Friend/ChatState';
import { Separator } from '@/app/_components/ui/separator';
import { SidebarTrigger } from '@/app/_components/ui/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '好友列表/ljh-design',
  description: 'ljh-design好友列表',
  keywords: ['ljh-design', '好友列表', '好友'],
};

export default async function Home() {
  return (
    <main className="entry">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <ChatState />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <ChatMain />
      </div>
    </main>
  );
}
