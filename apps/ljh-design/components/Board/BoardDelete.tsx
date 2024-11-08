import { Board } from '@/types/board';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { useBoardDeleteQuery } from '@/hook/query/useBoardQuery';
import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const BoardDelete = ({
  children,
  board,
  userId,
  id,
}: {
  children: React.ReactNode;
  userId: string;
  board: Board;
  id: string;
}) => {
  const { mutate, isPending } = useBoardDeleteQuery();
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  return (
    <>
      {/* @ts-ignore */}
      <Dialog>
        {/* @ts-ignore */}
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除看板</DialogTitle>
            <DialogDescription>
              确定要<span className="font-bold text-red-500">删除</span>该看板
              <span className="font-bold text-blue-400 mx-1">{board.name}</span>
              吗？删除后将无法恢复。
            </DialogDescription>
          </DialogHeader>
          <footer className="flex flex-col justify-end gap-2 mt-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                mutate(
                  { id },
                  {
                    onSuccess: () => {
                      closeRef.current?.click();
                      queryClient.invalidateQueries({ queryKey: [userId] });
                    },
                  }
                );
              }}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : '确定'}
            </Button>
            {/* @ts-ignore */}
            <DialogClose asChild>
              <Button
                variant="outline"
                ref={closeRef}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                取消
              </Button>
            </DialogClose>
          </footer>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoardDelete;
