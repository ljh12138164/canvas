'use client';

import { useBoardEditQuery } from '@/app/_hook/query/useBoardQuery';
import type { Sessions } from '@/app/_types/user';
import { Loader2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import LoginProtect from '../../Sign/LoginProtect';
import { Button } from '../../ui/button';
import Canvas from './Canvas';
type EditType = 'template' | 'board' | 'material';
export default function Edit({
  id,
  user,
  type,
}: {
  id: string | undefined;
  user: Sessions;
  type: EditType;
}) {
  const { isLoading, error, data } = useBoardEditQuery({
    id,
    type,
  });
  return (
    <LoginProtect>
      {isLoading && (
        <main className="h-full w-full flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-700" />
        </main>
      )}
      {(error || data?.length === 0) && (
        <div className="h-full w-full flex flex-col gap-y-5 items-center justify-center">
          <TriangleAlert className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground">获取不到画布信息</p>

          <Button variant="secondary">
            <Link href="/board">返回</Link>
          </Button>
        </div>
      )}
      {data?.length && <Canvas user={user} data={data[0]} type={type} />}
      {type === 'material' && <Canvas user={user} type={type} />}
    </LoginProtect>
  );
}
