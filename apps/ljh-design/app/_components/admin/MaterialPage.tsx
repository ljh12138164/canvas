'use client';
import AdminPeding from '@/app/_components/admin/AdminPeding';
import DateContent from '@/app/_components/admin/DateContent';
import EchartContent from '@/app/_components/admin/EchartContent';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { useMaterialList } from '@/app/_hook/query/useAdmin';
import { useIsAdmin } from '@/app/_hook/useAdmin';
import { useDatePicker } from '@/app/_store/datePicker';
import type { Profiles } from '@/app/_types/user';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import AvatarImage from '../Comand/AvatarImage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

/**
 * ### 素材统计
 * @returns 素材统计
 */
const Page = () => {
  const { isLoading } = useIsAdmin({ type: 'logout' });
  const { startTime, endTime, dates } = useDatePicker();
  const { data, isPending } = useMaterialList(startTime, endTime);

  const genData: Record<'datas' | 'date', number | string>[] = useMemo(() => {
    if (!data) return [];
    return dates.map((date) => ({
      datas: data.filter((item) => dayjs(item.created_at).isSame(date, 'day')).length,
      date,
    }));
  }, [dates, data]);
  if (isPending || isLoading) return <AdminPeding title="素材统计" />;
  return (
    <DateContent title="素材统计">
      <ScrollArea className="w-full h-[calc(100dvh-30px)] flex flex-col gap-4 px-4 pb-[7rem]">
        <EchartContent
          allData={data}
          startTime={startTime}
          endTime={endTime}
          genData={genData}
          label="素材统计"
          columns={[
            {
              key: 'name',
              label: '素材名字',
            },
            {
              key: 'created_at',
              label: '创建时间',
              render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              key: 'profiles',
              label: '用户',
              render: (value: Profiles) => {
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AvatarImage
                          src={
                            value.image ||
                            'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//avatar.svg'
                          }
                          alt="头像"
                          width={20}
                          height={20}
                          priority
                        />
                      </TooltipTrigger>
                      <TooltipContent>{value.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              },
            },
          ]}
        />
      </ScrollArea>
    </DateContent>
  );
};

export default Page;
