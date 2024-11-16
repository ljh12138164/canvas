'use client';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBoardUserQuery } from '@/hook/query/useBoardQuery';
import { useQueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import BoardCreate from './BoardCreate';
import BoardItem from './BoardItem';
import useUser from '@/hook/useUser';
const BoardMain = () => {
  const { userId, isLoading: isLoadingUser } = useUser();

  const footerRef = useRef<HTMLTableSectionElement>(null);
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useBoardUserQuery({
    userid: userId,
  });
  const query = useQueryClient();
  useEffect(() => {
    if (!hasNextPage || !footerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      {
        rootMargin: '-5px',
      }
    );
    observer.observe(footerRef.current);
    return () => observer?.disconnect();
  }, [hasNextPage, fetchNextPage]);
  return (
    <>
      {isLoadingUser && userId && (
        <ScrollArea className='w-full h-full overflow-auto '>
          {isLoading && (
            <>
              <Skeleton className='w-full h-[200px]' />
              <div className='h-[28px]' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='w-full h-[96px]' />
                <Skeleton className='w-full h-[96px]' />
                <Skeleton className='w-full h-[96px]' />
              </div>
            </>
          )}
          {!isLoading && !error && (
            <BoardCreate userId={userId} data={(data?.pages || []) as any} />
          )}
          {error && <div className='h-[200px]'></div>}
          <div className=' flex flex-col  gap-2 h-[calc(100dvh-300px)]   text-5xl'>
            {error && (
              <Button
                variant='outline'
                className=' w-fit text-black px-6 py-4 m-auto'
                onClick={() => query.invalidateQueries({ queryKey: [userId] })}
              >
                重试
              </Button>
            )}
            {!isLoading && !data?.pages.length && !error && (
              <p className='text-xl text-muted-foreground flex items-center justify-center h-full flex-col gap-2'>
                <span>还没有创建画布</span>
                <span>😢😢😢</span>
              </p>
            )}
            {!isLoading && !error && data?.pages.length && (
              <p className='text-[1rem] x px-2 font-bold mt-3 text-muted-foreground'>
                面板列表
              </p>
            )}
            <ScrollArea>
              {data?.pages.length && (
                <div
                  onClick={(e) => {
                    if (isFetching) e.stopPropagation();
                  }}
                >
                  <Table className={isFetching ? 'opacity-50' : ''}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[50px]'>名称</TableHead>
                        <TableHead className='w-[100px]'>尺寸</TableHead>
                        <TableHead className='w-[100px]'>创建时间</TableHead>
                        <TableHead className='w-[50px]'>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.pages.map((item) =>
                        // @ts-ignore
                        item.map((item) => (
                          <TableRow
                            onClick={() => {
                              if (!isFetching)
                                redirect(`/board/Edit/${item.id}`);
                            }}
                            key={item.id}
                            className='h-20 cursor-pointer'
                          >
                            <BoardItem board={item} userId={userId} />
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              <footer
                className='h-12 flex items-center justify-center'
                ref={footerRef}
              >
                {hasNextPage && !isFetchingNextPage && (
                  <p className='text-muted-foreground text-sm'>加载更多...</p>
                )}
                {isFetchingNextPage && (
                  <p className='text-muted-foreground text-sm flex flex-col items-center gap-2'>
                    <LuLoader2 className='size-4 animate-spin mr-2' />
                    <span>加载中...</span>
                  </p>
                )}
                {!hasNextPage && !isLoading && (
                  <p className='text-muted-foreground text-sm'>没有更多了</p>
                )}
              </footer>
            </ScrollArea>
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default BoardMain;
