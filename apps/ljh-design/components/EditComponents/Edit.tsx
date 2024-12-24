'use client';

import { useBoardEditQuery } from '@/hook/query/useBoardQuery';

import useUser from '@/hook/useUser';
import { Loader2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import LoginProtect from '../Sign/LoginProtect';
import { Button } from '../ui/button';
import Canvas from './Canvas';

export default function Edit({ params }: { params: string }) {
  const { user } = useUser();
  const { isLoading, error, data } = useBoardEditQuery({
    id: params,
    userId: user?.user.id,
  });
  return (
    <LoginProtect>
      {isLoading && (
        <main className='h-full w-full flex items-center justify-center'>
          <Loader2 className='animate-spin text-blue-700' />
        </main>
      )}
      {(error || data?.length === 0) && (
        <div className='h-full w-full flex flex-col gap-y-5 items-center justify-center'>
          <TriangleAlert className='size-6 text-muted-foreground' />
          <p className='text-muted-foreground'>获取不到画布信息</p>

          <Button variant='secondary'>
            <Link href='/board'>返回</Link>
          </Button>
        </div>
      )}
      {data && user?.user.id && (
        <Canvas userId={user?.user.id} data={data[0]} />
      )}
    </LoginProtect>
  );
}
