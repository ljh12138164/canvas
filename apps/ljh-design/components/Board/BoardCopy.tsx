import { useRef } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import BoardCreateFrom from './BoardCreateFrom';
import { Board } from '@/types/board';
import { useBoardCopyQuery } from '@/hook/query/useBoardQuery';
import { Loader2 } from 'lucide-react';

export const BoardCopy = ({
  children,
  board,
  setChange,
  userId,
}: {
  children: React.ReactNode;
  setChange?: (change: boolean) => void;
  board: Board;
  userId: string | undefined;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { mutate, isPending } = useBoardCopyQuery();
  return (
    <section onClick={(e) => e.stopPropagation()}>
      {/* @ts-ignore */}
      <Dialog>
        {/* @ts-ignore */}
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>复制看板</DialogTitle>
          </DialogHeader>
          <BoardCreateFrom
            setChange={setChange}
            type='copy'
            defaultValues={board}
            closeref={closeRef}
            userId={userId}
            mutate={mutate as any}
          >
            <DialogFooter className='mt-6 flex gap-1'>
              {/* @ts-ignore */}
              <DialogClose asChild>
                <Button
                  variant='outline'
                  ref={closeRef}
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  取消
                </Button>
              </DialogClose>
              <Button
                type='submit'
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {isPending ? <Loader2 className='animate-spin' /> : '复制'}
              </Button>
            </DialogFooter>
          </BoardCreateFrom>
        </DialogContent>
      </Dialog>
    </section>
  );
};
