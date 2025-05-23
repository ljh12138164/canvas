'use client';
import { useBoardUpdateQuery } from '@/app/_hook/query/useBoardQuery';
import type { Board } from '@/app/_types/board';
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

const BoardEdit = ({
  children,
  id,
  data,
  setChange,
  userId,
}: {
  children: React.ReactNode;
  data: Board;
  userId?: string;
  id: string;
  setChange?: (change: boolean) => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { mutate, isPending } = useBoardUpdateQuery({ id });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-lg ">
          <DialogHeader>
            <DialogTitle>编辑画布</DialogTitle>
            <DialogDescription>编辑你的画布</DialogDescription>
          </DialogHeader>
          <BoardCreateFrom
            setChange={setChange}
            type="edit"
            // @ts-ignore
            defaultValues={data}
            userId={userId}
            mutate={mutate as any}
            closeref={ref}
          >
            <DialogFooter className="mt-6 flex gap-1">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  ref={ref}
                  type="button"
                  aria-label="取消"
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
                保存
              </Button>
            </DialogFooter>
          </BoardCreateFrom>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default BoardEdit;
