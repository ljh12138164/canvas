'use client';
import { ShowFooter } from '@/app/_components/Formue/ShowFooter';
import { ShowHead } from '@/app/_components/Formue/ShowHead';
import { ShowMain } from '@/app/_components/Formue/ShowMain';
import { Skeleton } from '@/app/_components/ui/skeleton';
import { useGetShow } from '@/app/_hook/query/useShow';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export function ShowPage({ id }: { id: string }) {
  const router = useRouter();
  const { showData, showLoading } = useGetShow(id);

  if (showLoading)
    return (
      <div className="w-full space-y-6">
        {/* 头部骨架 */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>

        {/* 主体内容骨架 */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* 底部骨架 */}
        <div className="flex justify-end space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  if (!showData)
    return (
      <section className="w-full h-full items-center flex flex-col gap-2 justify-center">
        <span>无数据</span>
        <Button
          onClick={() => {
            router.push('/board/formue');
          }}
        >
          返回
        </Button>
      </section>
    );
  return (
    <>
      <ShowHead showData={showData} />
      <ShowMain showData={showData} />
      <ShowFooter showData={showData} />
    </>
  );
}
