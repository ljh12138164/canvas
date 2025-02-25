'use client';
import { useChat } from '@/app/_hook/use-chat';
import { useMessage } from '@/app/_hook/use-message';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

const ChatMain = () => {
  const [search, setSearch] = useState();
  // const {} = useMessage();
  useChat();
  return (
    <section>
      <ScrollArea className="h-[calc(100dvh-225px)] flex-1 border-b-2">sdf</ScrollArea>
      <footer className="h-12 flex gap-2 py-2">
        <Input className="flex-1" />
        <Button>发送</Button>
      </footer>
    </section>
  );
};

export default ChatMain;
