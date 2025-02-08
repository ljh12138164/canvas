'use client';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { useAiSession } from '@/app/_hook/query/useAi';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Response } from '../Comand/Response';

export default function CreatePop() {
  const [name, setName] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();
  const responseRef = useRef<{ closeModel: () => void }>(null);
  const { createAiSession, createAiSessionPending } = useAiSession();
  return (
    <Response
      title="新建对话"
      description="新建ai对话"
      disabled={createAiSessionPending}
      ref={responseRef}
      myTrigger={
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          <span>新建对话</span>
        </Button>
      }
      onConfirm={() => {
        createAiSession(
          { json: { name } },
          {
            onSuccess: (data) => {
              queryClient.invalidateQueries({ queryKey: ['aiSessionList'] });
              responseRef.current?.closeModel();
              router.push(`/board/ai/${data.id}`);
            },
          },
        );
      }}
    >
      <Input placeholder="请输入对话名称" value={name} onChange={(e) => setName(e.target.value)} />
    </Response>
  );
}
