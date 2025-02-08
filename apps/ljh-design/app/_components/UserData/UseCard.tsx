import type { UserDataResponseType } from '@/app/_hook/query/useUser';
import { useMemo } from 'react';
import { AreaChart, type AreaChartType } from '../Echarts/AreaChart';
import { LegendChart } from '../Echarts/LegendChart';
import { LineCharts } from '../Echarts/LineCharts';
import { PicChart } from '../Echarts/PicChart';
import HeadCard from './HeadCard';
interface UseCardProps {
  userData: UserDataResponseType;
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
}
export default function UseCard({ userData, startTime, endTime, genData }: UseCardProps) {
  // 创建的素材数量
  const totalCreate = useMemo(() => {
    return userData?.material.length ?? 0;
  }, [userData]);
  // 创建的模板数量
  const totalTemplate = useMemo(() => {
    return userData.board.filter((item) => item.isTemplate).length ?? 0;
  }, [userData]);
  // 创建的画板数量
  const totalBoard = useMemo(() => {
    return userData.board.filter((item) => !item.isTemplate).length ?? 0;
  }, [userData]);

  const picGenData = useMemo(() => {
    return [
      { label: '画板', type: 'board', visitors: totalBoard, fill: 'hsl(var(--chart-1))' },
      { label: '模板', type: 'templates', visitors: totalTemplate, fill: 'hsl(var(--chart-2))' },
      { label: '素材', type: 'material', visitors: totalCreate, fill: 'hsl(var(--chart-3))' },
    ];
  }, [totalBoard, totalTemplate, totalCreate]);
  return (
    <>
      <HeadCard
        data={[
          { title: '创建的画板', total: totalBoard },
          { title: '创建的模板', total: totalTemplate },
          { title: '创建的素材', total: totalCreate },
        ]}
      />
      {/* 图表 */}
      <AreaChart
        genData={genData}
        startTime={startTime}
        endTime={endTime}
        selectedType={['templates', 'material', 'board']}
      />
      <LineCharts
        startTime={startTime}
        endTime={endTime}
        selectedType={['templates', 'material', 'board']}
        genData={genData}
      />
      <LegendChart
        startTime={startTime}
        endTime={endTime}
        genData={genData}
        selectedType={[
          {
            dataKey: 'templates',
            type: 'natural',
            fill: 'hsl(var(--chart-1))',
            stroke: 'hsl(var(--chart-1))',
            stackId: 'a',
          },
          {
            dataKey: 'material',
            type: 'natural',
            fill: 'hsl(var(--chart-2))',
            stroke: 'hsl(var(--chart-2))',
            stackId: 'a',
          },
          {
            dataKey: 'board',
            type: 'natural',
            fill: 'hsl(var(--chart-3))',
            stroke: 'hsl(var(--chart-3))',
            stackId: 'a',
          },
        ]}
      />
      <PicChart startTime={startTime} endTime={endTime} genData={picGenData} type="user" />
    </>
  );
}
