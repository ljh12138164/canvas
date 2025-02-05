'use client';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/app/_components/ui/table';
import { useBoardListQuery, useBoardUserQuery } from '@/app/_hook/query/useBoardQuery';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuList, LuLoader } from 'react-icons/lu';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import BoardCreate from './BoardCreate';
import BoardItem from './BoardItem';
import { BoardTable } from './BoardTable';
import { columns } from './BoardTableColume';
const BoardMain = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const footerRef = useRef<HTMLTableSectionElement>(null);
  const { data, error, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useBoardUserQuery({ userId });
  const {
    // data: boardData,
    isLoading: boardLoading,
    // isFetching: boardFetching,
  } = useBoardListQuery();
  const [list, setList] = useState<boolean>(localStorage.getItem('showList') === 'list' || false);
  const query = useQueryClient();
  useEffect(() => {
    if (!hasNextPage || !footerRef.current || !list) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      {
        rootMargin: '-5px',
      },
    );
    observer.observe(footerRef.current);
    return () => observer?.disconnect();
  }, [hasNextPage, fetchNextPage, list]);
  return (
    <>
      <ScrollArea className="w-full h-full overflow-auto ">
        {isLoading && (
          <>
            <Skeleton className="w-full h-[200px]" />
            <div className="h-[28px]" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full h-[96px]" />
              <Skeleton className="w-full h-[96px]" />
              <Skeleton className="w-full h-[96px]" />
            </div>
          </>
        )}
        {!isLoading && !boardLoading && !error && (
          // @ts-ignore
          <BoardCreate data={data?.pages || []} userId={userId} />
        )}
        {error && <div className="h-[200px]" />}
        {/* 表格 */}
        <div className=" flex flex-col  gap-2 h-[calc(100dvh-300px)]   text-5xl">
          {error && (
            <Button
              variant="outline"
              className=" w-fit text-black px-6 py-4 m-auto"
              onClick={() => query.invalidateQueries({ queryKey: ['board', userId] })}
            >
              重试
            </Button>
          )}
          {!isLoading && !boardLoading && !data?.pages.length && !error && (
            <p className="text-xl text-muted-foreground flex  h-full flex-col gap-2">
              <span>还没有创建画布</span>
              <span>😢😢😢</span>
            </p>
          )}
          {/* 表格 */}
          {!isLoading && !boardLoading && !error && data?.pages.length && (
            <section className="text-[1rem] x px-2 font-bold mt-3 w-full flex justify-between items-center text-muted-foreground">
              <span className="flex items-center gap-2">
                <LuList className="size-4" />
                面板列表
              </span>
              <div className="w-36">
                <Select
                  value={list ? 'list' : 'grid'}
                  onValueChange={(value) => {
                    setList(value === 'list');
                    localStorage.setItem('showList', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={list ? '列表' : '网格'} className="text-sm " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem disabled={list || isLoading} value="list">
                      列表
                    </SelectItem>
                    <SelectItem disabled={!list || isLoading} value="grid">
                      网格
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}
          {list && !isLoading && !boardLoading && (
            <ScrollArea>
              {data?.pages.length && (
                <div
                  onClick={(e) => {
                    if (isFetching) e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    if (isFetching) e.stopPropagation();
                  }}
                >
                  <Table className={isFetching ? 'opacity-50' : ''}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">名称</TableHead>
                        <TableHead className="w-[100px]">尺寸</TableHead>
                        <TableHead className="w-[100px]">创建时间</TableHead>
                        <TableHead className="w-[50px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.pages.map((item) =>
                        item.map((item) => (
                          <TableRow
                            onClick={() => {
                              if (!isFetching) router.push(`/Edit/${item.id}`);
                            }}
                            key={item.id}
                            className="h-20 cursor-pointer"
                          >
                            <BoardItem
                              board={{
                                ...item,
                                updated_at: item.updated_at as string,
                              }}
                              userId={userId}
                            />
                          </TableRow>
                        )),
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              <footer className="h-12 flex items-center justify-center" ref={footerRef}>
                {hasNextPage && !isFetchingNextPage && (
                  <p className="text-muted-foreground text-sm">加载更多...</p>
                )}
                {isFetchingNextPage && (
                  <p className="text-muted-foreground text-sm flex flex-col items-center gap-2">
                    <LuLoader className="size-4 animate-spin mr-2" />
                    <span>加载中...</span>
                  </p>
                )}
                {!hasNextPage && !isLoading && (
                  <p className="text-muted-foreground text-sm">没有更多了</p>
                )}
              </footer>
            </ScrollArea>
          )}
          {!list && !isLoading && !boardLoading && (
            <BoardTable
              columns={columns}
              // @ts-ignore
              data={data?.pages.flat() || []}
            />
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default BoardMain;
