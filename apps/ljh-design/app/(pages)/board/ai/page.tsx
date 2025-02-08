import AiMain from '@/app/_components/Ai/AiMain';
import CreatePop from '@/app/_components/Ai/CreatePop';
import { ScrollArea } from '@/app/_components/ui/scroll-area';

const AI = () => {
  return (
    <section className="h-full w-full">
      <ScrollArea className="h-[100dvh-100px] w-full flex flex-col gap-4 space-y-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex  justify-between gap-2 w-full">
            <h2 className="text-2xl font-bold">历史对话</h2>
            <CreatePop />
          </div>
        </div>
        <AiMain />
      </ScrollArea>
    </section>
  );
};

export default AI;
