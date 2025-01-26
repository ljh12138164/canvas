import { useBoardCopyQuery } from '@/app/_hook/query/useBoardQuery';
import type { Board } from '@/app/_types/board';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import BoardCreateFrom from './BoardCreateFrom';

export const BoardCopy = ({
  children,
  board,
  setChange,
  userId,
}: {
  children: React.ReactNode;
  setChange?: (change: boolean) => void;
  board: Board;
  userId?: string;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { mutate, isPending } = useBoardCopyQuery();
  return (
    <section onClick={(e) => e.stopPropagation()}>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>复制看板</DialogTitle>
            <DialogDescription>
              确定要复制<span className="font-bold text-blue-400 mx-1">{board.name}</span>
              吗？
            </DialogDescription>
          </DialogHeader>
          <BoardCreateFrom
            setChange={setChange}
            type="copy"
            // @ts-ignore
            defaultValues={board}
            closeref={closeRef}
            userId={userId}
            mutate={mutate as any}
          >
            <DialogFooter className="mt-6 flex gap-1">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  ref={closeRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  取消
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {isPending ? <Loader2 className="animate-spin" /> : '复制'}
              </Button>
            </DialogFooter>
          </BoardCreateFrom>
        </DialogContent>
      </Dialog>
    </section>
  );
};
