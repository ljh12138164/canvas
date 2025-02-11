import AiMain from '@/app/_components/Ai/AiMain';
import CreatePop from '@/app/_components/Ai/CreatePop';
import ColorCard from '@/app/_components/Comand/ColorCard';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { AtomIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI助手/ljh-design',
  description: 'ljh-designAI助手',
};

const AI = () => {
  return (
    <section className="h-full w-full">
      <ScrollArea className="h-[100dvh-100px] w-full flex flex-col gap-4 space-y-4 p-4">
        <ColorCard
          title="创建你的AI对话"
          icon={<AtomIcon className="" />}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-none shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-2 w-full">
              <CreatePop />
            </div>
          </div>
        </ColorCard>
        <AiMain />
      </ScrollArea>
    </section>
  );
};

export default AI;
