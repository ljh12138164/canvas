'use client';
import AdminPeding from '@/app/_components/admin/AdminPeding';
import DateContent from '@/app/_components/admin/DateContent';
import EchartContent from '@/app/_components/admin/EchartContent';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { useUserDataList } from '@/app/_hook/query/useAdmin';
import { useIsAdmin } from '@/app/_hook/useAdmin';
import { useDatePicker } from '@/app/_store/datePicker';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const Page = () => {
  const { isLoading } = useIsAdmin({ type: 'logout' });
  const { startTime, endTime, dates } = useDatePicker();
  const { data, isPending } = useUserDataList(startTime, endTime);

  const genData: Record<'datas' | 'date', number | string>[] = useMemo(() => {
    if (!data) return [];
    return dates.map((date) => ({
      datas: data.filter((item) => dayjs(item.created_at).isSame(date, 'day')).length,
      date,
    }));
  }, [dates, data]);
  if (isPending || isLoading) return <AdminPeding title="用户统计" />;
  return (
    <DateContent title="用户统计">
      <ScrollArea className="w-full h-[calc(100dvh-30px)] flex flex-col gap-4 px-4 pb-[7rem]">
        <EchartContent startTime={startTime} endTime={endTime} genData={genData} label="用户统计" />
      </ScrollArea>
    </DateContent>
  );
};

export default Page;
