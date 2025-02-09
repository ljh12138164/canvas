'use client';
import { AreaChart } from '@/app/_components/Echarts/AreaChart';
import { LegendChart } from '@/app/_components/Echarts/LegendChart';
import { LineCharts } from '@/app/_components/Echarts/LineCharts';
import { PicChart } from '@/app/_components/Echarts/PicChart';
import AdminPeding from '@/app/_components/admin/AdminPeding';
import DateContent from '@/app/_components/admin/DateContent';
import { ScrollArea } from '@/app/_components/ui/scroll-area';

import { type DashboardListResponseType, useDashboardList } from '@/app/_hook/query/useAdmin';
import { useIsAdmin } from '@/app/_hook/useAdmin';
import { useDatePicker } from '@/app/_store/datePicker';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { useMemo } from 'react';
type GenData = {
  filterData: {
    date: string;
    templates: number;
    material: number;
    board: number;
    upvotes: number;
    collections: number;
    show: number;
  }[];
  totalUser: number;
  totalLike: number;
  totalCollect: number;
  totalDesign: number;
  totalTemplate: number;
  totalBoard: number;
  totalMaterial: number;
};
const Page = () => {
  const { isLoading } = useIsAdmin({ type: 'logout' });
  const { startTime, endTime, dates } = useDatePicker();
  const { data, isPending } = useDashboardList(startTime, endTime);

  // 生成数据 TODO: WEB WORKER
  const genDataFn = useMemoizedFn(
    (data: string[], userData: DashboardListResponseType): GenData => {
      if (!userData)
        return {
          filterData: [],
          totalUser: 0,
          totalLike: 0,
          totalCollect: 0,
          totalDesign: 0,
          totalTemplate: 0,
          totalBoard: 0,
          totalMaterial: 0,
        };
      const totalUser = userData.length;
      const totalLike = userData
        .map((item) => item.show.map((item) => item.upvotes.length).reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
      const totalCollect = userData
        .map((item) => item.show.map((item) => item.collections.length).reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
      const totalDesign = userData.map((item) => item.show.length).reduce((a, b) => a + b, 0);
      const totalTemplate = userData
        .map((item) => item.board.filter((item) => item.isTemplate).length)
        .reduce((a, b) => a + b, 0);
      const totalBoard = userData
        .map((item) => item.board.filter((item) => !item.isTemplate).length)
        .reduce((a, b) => a + b, 0);
      const totalMaterial = userData.map((item) => item.material.length).reduce((a, b) => a + b, 0);

      const filterData = data
        .map((Cooutedate) => {
          return userData.map((item) => {
            const show = item.show.filter(
              (show) => dayjs(show.created_at).format('YYYY-MM-DD') === Cooutedate,
            );
            const board = item.board.filter(
              (board) =>
                dayjs(board.created_at).format('YYYY-MM-DD') === Cooutedate && !board.isTemplate,
            );
            const templates = item.board.filter(
              (board) =>
                dayjs(board.created_at).format('YYYY-MM-DD') === Cooutedate && board.isTemplate,
            );

            const material = item.material.filter(
              (material) => dayjs(material.created_at).format('YYYY-MM-DD') === Cooutedate,
            );

            const upvotes = item.upvotes.filter(
              (upvote) => dayjs(upvote.created_at).format('YYYY-MM-DD') === Cooutedate,
            );

            const collections = item.collections.filter(
              (collection) => dayjs(collection.created_at).format('YYYY-MM-DD') === Cooutedate,
            );

            return {
              date: Cooutedate,
              templates: templates.length,
              material: material.length,
              board: board.length,
              upvotes: upvotes.length,
              collections: collections.length,
              show: show.length,
            };
          });
        })
        .reduce((acc, curr) => {
          const sum = curr.reduce(
            (acc, curr) => {
              return {
                date: curr.date,
                templates: acc.templates + curr.templates,
                material: acc.material + curr.material,
                board: acc.board + curr.board,
                upvotes: acc.upvotes + curr.upvotes,
                collections: acc.collections + curr.collections,
                show: acc.show + curr.show,
              };
            },
            {
              date: '',
              templates: 0,
              material: 0,
              board: 0,
              upvotes: 0,
              collections: 0,
              show: 0,
            },
          );
          return acc.concat(sum);
        }, []);
      return {
        filterData,
        totalUser,
        totalLike,
        totalCollect,
        totalDesign,
        totalTemplate,
        totalBoard,
        totalMaterial,
      };
    },
  );

  const genData: GenData = useMemo(() => {
    if (!data) return {} as GenData;
    return genDataFn(dates, data);
  }, [dates, data, genDataFn]);
  //   {
  //     label: string;
  //     type: string;
  //     visitors: number;
  //     fill: string;
  // }[]
  const picGenData = useMemo(() => {
    return [
      { label: '画板', type: 'board', visitors: genData.totalBoard, fill: 'hsl(var(--chart-1))' },
      {
        label: '模板',
        type: 'templates',
        visitors: genData.totalTemplate,
        fill: 'hsl(var(--chart-2))',
      },
      {
        label: '素材',
        type: 'material',
        visitors: genData.totalMaterial,
        fill: 'hsl(var(--chart-3))',
      },
      {
        label: '点赞',
        type: 'upvotes',
        visitors: genData.totalLike,
        fill: 'hsl(var(--chart-4))',
      },
      {
        label: '收藏',
        type: 'collections',
        visitors: genData.totalCollect,
        fill: 'hsl(var(--chart-5))',
      },
      {
        label: '发布',
        type: 'show',
        visitors: genData.totalDesign,
        fill: 'hsl(var(--chart-6))',
      },
    ];
  }, [genData]);
  if (isPending || isLoading) return <AdminPeding title="仪表盘统计" />;
  return (
    <DateContent title="仪表盘统计">
      <ScrollArea className="w-full h-[calc(100dvh-10rem)] px-2">
        {/* 数据统计卡片 */}
        <AreaChart
          genData={genData.filterData}
          startTime={startTime}
          endTime={endTime}
          selectedType={['upvotes', 'collections', 'show', 'templates', 'material', 'board']}
        />
        <LineCharts
          startTime={startTime}
          endTime={endTime}
          selectedType={['upvotes', 'collections', 'show', 'templates', 'material', 'board']}
          genData={genData.filterData}
        />
        <LegendChart
          startTime={startTime}
          endTime={endTime}
          genData={genData.filterData}
          selectedType={[
            {
              dataKey: 'upvotes',
              type: 'natural',
              fill: 'hsl(var(--chart-1))',
              stroke: 'hsl(var(--chart-1))',
              stackId: 'a',
            },
            {
              dataKey: 'collections',
              type: 'natural',
              fill: 'hsl(var(--chart-2))',
              stroke: 'hsl(var(--chart-2))',
              stackId: 'a',
            },
            {
              dataKey: 'show',
              type: 'natural',
              fill: 'hsl(var(--chart-3))',
              stroke: 'hsl(var(--chart-3))',
              stackId: 'a',
            },
            {
              dataKey: 'templates',
              type: 'natural',
              fill: 'hsl(var(--chart-4))',
              stroke: 'hsl(var(--chart-4))',
              stackId: 'a',
            },
            {
              dataKey: 'material',
              type: 'natural',
              fill: 'hsl(var(--chart-5))',
              stroke: 'hsl(var(--chart-5))',
              stackId: 'a',
            },
            {
              dataKey: 'board',
              type: 'natural',
              fill: 'hsl(var(--chart-6))',
              stroke: 'hsl(var(--chart-6))',
              stackId: 'a',
            },
          ]}
        />
        <PicChart startTime={startTime} endTime={endTime} genData={picGenData} type="any" />
      </ScrollArea>
    </DateContent>
  );
};

export default Page;
