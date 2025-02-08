import { Card } from '@/app/_components/ui/card';
import { type UserDataResponseType, useUserData } from '@/app/_hook/query/useUser';
import { getDateNum } from '@/app/_lib/utils';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { BarChart, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { zhCN } from 'react-day-picker/locale';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';
import DesignCard from './DesignCard';
import UseCard from './UseCard';

export default function DataShow() {
  const [type, setType] = useState<'use' | 'design'>('use');
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const { userData, userDataLoading } = useUserData(true, startTime, endTime);
  const handleStartSelect = (date: Date | undefined) => {
    toast.dismiss();
    if (!date) setStartTime(undefined);
    else {
      if (endTime && date > endTime) {
        toast.error('开始时间不能大于结束时间');
        setStartTime(endTime);
      } else if (date.getTime() > new Date().getTime()) {
        toast.error('开始时间不能大于当前时间');
        setStartTime(new Date());
      } else {
        setStartTime(date);
      }
    }
  };
  const handleEndSelect = (date: Date | undefined) => {
    toast.dismiss();

    if (!date) setEndTime(undefined);
    else {
      if (startTime && dayjs(date).isBefore(dayjs(startTime))) {
        toast.error('结束时间不能小于开始时间');
        setEndTime(startTime);
      } else if (date.getTime() > new Date().getTime()) {
        toast.error('开始时间不能大于当前时间');
        setStartTime(new Date());
      } else {
        setEndTime(date);
      }
    }
  };
  const genDataFn = useMemoizedFn((data: string[], userData: UserDataResponseType) => {
    return data.map((item) => {
      const show = userData.show.filter(
        (show) => dayjs(show.created_at).format('YYYY-MM-DD') === item,
      );
      const board = userData.board.filter(
        (board) => dayjs(board.created_at).format('YYYY-MM-DD') === item && !board.isTemplate,
      );
      const templates = userData.board.filter(
        (board) => dayjs(board.created_at).format('YYYY-MM-DD') === item && board.isTemplate,
      );

      const material = userData.material.filter(
        (material) => dayjs(material.created_at).format('YYYY-MM-DD') === item,
      );

      const upvotes = userData.upvotes.filter(
        (upvote) => dayjs(upvote.created_at).format('YYYY-MM-DD') === item,
      );

      const collections = userData.collections.filter(
        (collection) => dayjs(collection.created_at).format('YYYY-MM-DD') === item,
      );

      return {
        date: item,
        templates: templates.length,
        material: material.length,
        board: board.length,
        upvotes: upvotes.length,
        collections: collections.length,
        show: show.length,
      };
    });
  });
  // const chartData = [
  //   { date: '2024-04-01', desktop: 222, mobile: 150 },
  //   { date: '2024-04-02', desktop: 97, mobile: 180 },
  // ];
  //生成开始到结束时间每天的数量
  const genData: Record<
    'templates' | 'material' | 'board' | 'upvotes' | 'collections' | 'show' | 'date',
    number | string
  >[] = useMemo(() => {
    if (!userData) return [];
    // 如果没设置开始时间和结束时间设置3个月
    if (!startTime && !endTime) {
      // 设置时间数组
      const date = getDateNum(startTime, endTime);
      return genDataFn(date, userData);
    }
    // 如果没有开始时间
    if (!startTime && endTime) {
      const date = getDateNum(startTime, endTime);
      return genDataFn(date, userData);
    }
    // 如果没有结束时间
    if (!endTime && startTime) {
      const date = getDateNum(startTime, endTime);
      return genDataFn(date, userData);
    }
    // 如果设置了开始时间和结束时间
    if (startTime && endTime) {
      const date = getDateNum(startTime, endTime);
      return genDataFn(date, userData);
    }
    return [];
  }, [userData]);

  return (
    <main className="w-full h-full flex flex-col gap-4">
      <nav className="h-10 flex">
        {/* 不同的数据显示 */}
        <Card className=" rounded-none flex items-center justify-center">
          <Button
            variant={type === 'use' ? 'default' : 'ghost'}
            className="w-full rounded-sm"
            onClick={() => setType('use')}
          >
            <User />
            使用统计
          </Button>
          <Button
            variant={type === 'design' ? 'default' : 'ghost'}
            className="w-full rounded-sm"
            onClick={() => setType('design')}
          >
            <BarChart />
            话题统计
          </Button>
        </Card>
        {/* 时间选择 */}
        <section className="ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <span>开始时间</span>
                {startTime ? `: ${dayjs(startTime).format('YYYY-MM-DD')}` : ''}
                {startTime && (
                  <div
                    className="text-xs text-muted-foreground"
                    onClick={() => setStartTime(undefined)}
                  >
                    <X />
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[20rem]">
              <DayPicker
                mode="single"
                locale={zhCN}
                selected={startTime}
                onSelect={handleStartSelect}
                footer={
                  <div className="mt-2">
                    <div>
                      开始时间: {startTime ? dayjs(startTime).format('YYYY-MM-DD') : '未选择'}
                    </div>
                    <div>结束时间: {endTime ? dayjs(endTime).format('YYYY-MM-DD') : '未选择'}</div>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>

          <span className="text-xl text-muted-foreground mx-2">-</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <span>结束时间</span>
                {endTime ? `: ${dayjs(endTime).format('YYYY-MM-DD')}` : ''}
                {endTime && (
                  <div
                    className="text-xs text-muted-foreground"
                    onClick={() => setEndTime(undefined)}
                  >
                    <X />
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[20rem]">
              <DayPicker
                mode="single"
                locale={zhCN}
                selected={endTime}
                onSelect={handleEndSelect}
                footer={
                  <div className="mt-2">
                    <div>
                      开始时间: {startTime ? dayjs(startTime).format('YYYY-MM-DD') : '未选择'}
                    </div>
                    <div>结束时间: {endTime ? dayjs(endTime).format('YYYY-MM-DD') : '未选择'}</div>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>
        </section>
      </nav>
      {/* 数据统计卡片 */}
      {!userDataLoading && type === 'design' && (
        <DesignCard
          userData={userData!}
          startTime={startTime}
          endTime={endTime}
          genData={genData}
        />
      )}
      {!userDataLoading && type === 'use' && (
        <UseCard userData={userData!} startTime={startTime} endTime={endTime} genData={genData} />
      )}

      {userDataLoading && (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </section>
          <section className="w-full h-[12rem] flex flex-col gap-4">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </section>
        </>
      )}
    </main>
  );
}
