'use client';
import { useBoardDeleteQuery } from '@/app/_hook/query/useBoardQuery';
import { indexDBChange } from '@/app/_lib/utils';
import type { Board } from '@/app/_types/board';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';
import toast from 'react-hot-toast';
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

const BoardDelete = ({
  children,
  board,
  userId,
  setChange,
  id,
}: {
  children: React.ReactNode;
  userId?: string;
  board: Board;
  setChange?: (res: boolean) => void;
  id: string;
}) => {
  const { mutate, isPending } = useBoardDeleteQuery();
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  return (
    <section onClick={(e) => e.stopPropagation()}>
      <Dialog>
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
                if (userId) {
                  mutate(
                    { json: { id, image: board.image as string } },
                    {
                      onSuccess: () => {
                        closeRef.current?.click();
                        queryClient.invalidateQueries({ queryKey: ['board'] });
                      },
                      onError: () => {
                        toast.dismiss();
                        toast.error('删除失败');
                      },
                    },
                  );
                } else {
                  toast.success('删除成功');
                  indexDBChange({
                    type: 'delete',
                    deletItem: board.id,
                  });
                  if (setChange) {
                    setChange(true);
                  }
                  closeRef.current?.click();
                }
              }}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : '确定'}
            </Button>
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
    </section>
  );
};

export default BoardDelete;
