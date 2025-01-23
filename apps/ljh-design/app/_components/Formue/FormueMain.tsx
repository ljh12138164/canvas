'use client';
import { Button } from '@/app/_components/ui/button';
import { Skeleton } from '@/app/_components/ui/skeleton';
import { useGetFormue } from '@/app/_hook/query/useShow';
import { useMemoizedFn } from 'ahooks';
import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Input } from '../ui/input';
import FormueList from './FormueList';

export default function FormueMain() {
  const searchParam = useSearchParams();
  const [search, setSearch] = useState<string>(searchParam.get('search') || '');
  const router = useRouter();
  const { formueLoading } = useGetFormue();
  const updateSearchs = useMemo(
    () =>
      debounce((value: string) => {
        router.push(`/board/formue?search=${value}`);
      }, 1000),
    [router],
  );
  const handleSearch = useMemoizedFn((value: string) => {
    setSearch(value);
    updateSearchs(value);
  });
  return (
    <section className="p-4 flex flex-col gap-4">
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">设计</h1>
        <Link href="/board/formue/create">
          <Button>发布新帖</Button>
        </Link>
      </nav>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          className="hover:w-[400px] w-[300px] transition-all duration-300"
          placeholder="搜索"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {formueLoading ? (
        <div className="space-y-6">
          {new Array(3).fill(0).map((_) => (
            <div key={nanoid()} className="space-y-3">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-[1px] w-full" />
            </div>
          ))}
        </div>
      ) : (
        <FormueList />
      )}
    </section>
  );
}
