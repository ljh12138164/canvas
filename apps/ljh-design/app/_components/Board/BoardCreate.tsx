'use client';
import { useBoardQuery } from '@/app/_hook/query/useBoardQuery';
import type { Board } from '@/app/_types/board';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { FaArrowRight, FaStar } from 'react-icons/fa6';
import ColorCard from '../Comand/ColorCard';
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
const BoardCreate = ({
  setChange,
  data,
  userId,
}: {
  setChange?: (change: boolean) => void;
  data: Board[];
  userId?: string;
}) => {
  const { mutate, isPending } = useBoardQuery();
  const router = useRouter();

  const ref = useRef<HTMLButtonElement>(null);
  return (
    <section className="p-2 h-[200px]  w-full">
      <ColorCard
        title={data?.length ? '创建你的画布以开始使用' : '创建第一个画布'}
        icon={<FaStar className="text-yellow-500 text-[2rem] animate-pulse hover:animate-spin" />}
        className="bg-gradient-to-r from-blue-700 to-blue-300 border-none shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <main className="flex flex-col justify-center gap-2">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-fit flex items-center gap-2 justify-center">
                  <span>开始</span>
                  <FaArrowRight />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-lg ">
                <DialogHeader>
                  <DialogTitle>创建画布</DialogTitle>
                  <DialogDescription>创建你的画布</DialogDescription>
                </DialogHeader>
                <BoardCreateFrom
                  setChange={setChange}
                  type="create"
                  // @ts-ignore
                  mutate={mutate}
                  closeref={ref}
                  userId={userId}
                >
                  <DialogFooter className="mt-6 flex gap-1">
                    <DialogClose asChild>
                      <Button variant="outline" ref={ref} type="button">
                        取消
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? <Loader2 className="animate-spin" /> : '创建'}
                    </Button>
                  </DialogFooter>
                </BoardCreateFrom>
              </DialogContent>
            </Dialog>

            <Button
              className="w-fit flex items-center gap-2 justify-center"
              onClick={() => router.push('/board/template')}
            >
              <span>选择模板开始</span>
            </Button>
          </div>
        </main>
      </ColorCard>
    </section>
  );
};

export default BoardCreate;
