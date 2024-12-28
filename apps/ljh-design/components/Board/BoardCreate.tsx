'use client';
import { useBoardQuery } from '@/hook/query/useBoardQuery';
import { Board } from '@/types/board';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { FaArrowRight, FaStar } from 'react-icons/fa6';
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
  token,
  setChange,
  data,
}: {
  token: string | undefined;
  setChange?: (change: boolean) => void;
  data: Board[];
}) => {
  const { mutate, isPending } = useBoardQuery(token);

  const ref = useRef<HTMLButtonElement>(null);
  return (
    <section className='p-2 h-[200px] flex justify-center items-center'>
      <div className=' bg-gradient-to-r grid  grid-cols-[168px,1fr] from-blue-700 to-blue-300 w-full h-full rounded-lg p-2'>
        <header className='w-full h-full p-6 flex justify-center items-center'>
          <div className='bg-white/50 rounded-full size-28  flex justify-center items-center '>
            <div className='bg-white rounded-full size-20 flex  justify-center items-center z-10'>
              <FaStar className='text-yellow-500 text-[2rem] animate-pulse hover:animate-spin' />
            </div>
          </div>
        </header>
        <main className='flex flex-col justify-center gap-2'>
          <div className='text-white text-2xl '>
            {data?.length ? '创建你的画布以开始使用' : '创建第一个画布'}
          </div>
          <span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='w-fit flex items-center gap-2 justify-center'
                >
                  <span>开始</span>
                  <FaArrowRight />
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px] rounded-lg '>
                <DialogHeader>
                  <DialogTitle>创建画布</DialogTitle>
                  <DialogDescription>创建你的画布</DialogDescription>
                </DialogHeader>
                <BoardCreateFrom
                  setChange={setChange}
                  type='create'
                  token={token}
                  mutate={mutate as any}
                  closeref={ref}
                >
                  <DialogFooter className='mt-6 flex gap-1'>
                    <DialogClose asChild>
                      <Button variant='outline' ref={ref} type='button'>
                        取消
                      </Button>
                    </DialogClose>
                    <Button type='submit' disabled={isPending}>
                      {isPending ? (
                        <Loader2 className='animate-spin' />
                      ) : (
                        '创建'
                      )}
                    </Button>
                  </DialogFooter>
                </BoardCreateFrom>
              </DialogContent>
            </Dialog>
          </span>
        </main>
      </div>
    </section>
  );
};

export default BoardCreate;
