import { Button } from '@/app/_components/ui/button';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { Skeleton } from '@/app/_components/ui/skeleton';
import { useAiSessionDelete, useAiSessionList } from '@/app/_hook/query/useAi';
import { cn } from '@/app/_lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Trash } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Response } from '../Comand/Response';
import { Card } from '../ui/card';

export default function AiList({
  type = 'board',
  onClick,
}: {
  type?: 'board' | 'sider';
  onClick?: (id: string) => void;
}) {
  const router = useRouter();
  const responseRef = useRef<{ closeModel: () => void }>(null);
  const queryClient = useQueryClient();
  const { getAiSessionList, getAiSessionListLoading } = useAiSessionList();
  const { getAiSessionDelete } = useAiSessionDelete();

  const handleDelete = (id: string) => {
    getAiSessionDelete(
      { json: { id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['aiSessionList'] });
          responseRef.current?.closeModel();
        },
      },
    );
  };

  if (getAiSessionListLoading) {
    return (
      <div className="space-y-2 p-4 flex flex-col gap-4">
        {Array.from({ length: 5 }, () => (
          <Skeleton key={nanoid()} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className={cn('h-screen', type === 'sider' && 'h-full')}>
      <h2 className="text-2xl font-bold">历史对话</h2>
      <div className="space-y-2 p-4">
        {getAiSessionList?.map((chat) => (
          <Card
            onClick={() => {
              if (type === 'board') {
                router.push(`/board/ai/${chat.id}`);
              } else {
                onClick?.(chat.id);
              }
            }}
            key={chat.id}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <p className="line-clamp-1 flex flex-col gap-1">
              <span className="font-bold">{chat.name || '新对话'}</span>
              <span className="text-sm text-gray-500">
                {dayjs(chat.created_at).format('YYYY-MM-DD')}
              </span>
            </p>
            <Response
              title="删除对话"
              description="删除对话"
              showDescription={false}
              myTrigger={
                <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                  <Trash className="h-4 w-4" type="button" aria-label="删除对话" />
                </Button>
              }
              ref={responseRef}
              onConfirm={() => {
                handleDelete(chat.id);
              }}
            >
              <div>
                <p>
                  确定删除 <span className="font-bold text-red-500">{chat.name}</span> 对话吗？
                </p>
              </div>
            </Response>
          </Card>
        ))}
        {getAiSessionList?.length === 0 && (
          <div className="text-center text-gray-500">暂无对话</div>
        )}
      </div>
    </ScrollArea>
  );
}
