'use client';
import { Button } from '@/app/_components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';
import { Skeleton } from '@/app/_components/ui/skeleton';
import { useGetFormue } from '@/app/_hook/query/useShow';
import { useMemoizedFn } from 'ahooks';
import { debounce } from 'lodash-es';
import { MessageSquare } from 'lucide-react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FaArrowRight, FaStar } from 'react-icons/fa6';
import ColorCard from '../Comand/ColorCard';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
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
    <ScrollArea className="h-[calc(100dvh-120px)] w-full flex flex-col gap-4 space-y-4">
      <section className="p-4 flex flex-col gap-4">
        <ColorCard
          icon={
            <MessageSquare className="text-yellow-500 text-[2rem] animate-pulse hover:animate-spin" />
          }
          title="分享你的模板和素材"
          className="from-purple-600 via-pink-500 to-orange-400"
        >
          <Button
            variant="outline"
            className="w-fit flex items-center gap-2 justify-center"
            asChild
          >
            <Link href="/board/formue/create">
              <span>发布新帖</span>
              <FaArrowRight />
            </Link>
          </Button>
        </ColorCard>
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
              <Card className="p-4 cursor-pointer" key={nanoid()}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <Skeleton className="w-10 h-10" />
                    <div className="text-sm text-gray-500 whitespace-nowrap flex gap-2 items-center">
                      <Skeleton className="w-10 h-10" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent aria-describedby="formue-item-content">
                  <CardDescription className="flex gap-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-10 h-10" />
                    <Skeleton className="w-10 h-10" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <FormueList />
        )}
      </section>
    </ScrollArea>
  );
}
