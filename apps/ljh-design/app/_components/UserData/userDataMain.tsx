'use client';

import { ScrollArea } from '@/app/_components/ui/scroll-area';
import useUser from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import DataShow from './DataShow';
// import { AreaChart } from '@/app/_components/Echarts/AreaChart';

export default function UserDataMain() {
  const router = useRouter();
  const { user, loading } = useUser({ redirects: true });
  if (loading) return <></>;
  if (!user) router.push('/sign-in');

  return (
    <section className="w-full h-full p-2">
      <ScrollArea className="h-full w-full flex flex-col gap-4 space-y-4 p-4">
        <DataShow />
      </ScrollArea>
    </section>
  );
}
