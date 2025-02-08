import type { UserDataResponseType } from '@/app/_hook/query/useUser';
import { useMemo } from 'react';
import { AreaChart, type AreaChartType } from '../Echarts/AreaChart';
import { LegendChart } from '../Echarts/LegendChart';
import { LineCharts } from '../Echarts/LineCharts';
import { PicChart } from '../Echarts/PicChart';
import HeadCard from './HeadCard';
interface DesignCardProps {
  userData: UserDataResponseType;
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
}

export default function DesignCard({ userData, startTime, endTime, genData }: DesignCardProps) {
  const totalLike = useMemo(() => {
    return userData?.show.map((item) => item.upvotes.length).reduce((a, b) => a + b, 0) ?? 0;
  }, [userData]);
  const totalCollect = useMemo(() => {
    return userData?.show.map((item) => item.collections.length).reduce((a, b) => a + b, 0) ?? 0;
  }, [userData]);
  const totalDesign = useMemo(() => {
    return userData?.show.length ?? 0;
  }, [userData]);

  // const chartData = [
  //   { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  //   { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  //   { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  //   { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  //   { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
  // ];

  const picGenData = useMemo(() => {
    return [
      { label: '点赞', type: 'upvotes', visitors: totalLike, fill: 'hsl(var(--chart-1))' },
      { label: '收藏', type: 'collections', visitors: totalCollect, fill: 'hsl(var(--chart-2))' },
      { label: '发布', type: 'show', visitors: totalDesign, fill: 'hsl(var(--chart-3))' },
    ];
  }, [totalLike, totalCollect, totalDesign]);
  return (
    <>
      <HeadCard
        data={[
          { title: '话题总点赞', total: totalLike },
          { title: '话题总收藏', total: totalCollect },
          { title: '话题总发布', total: totalDesign },
        ]}
      />
      {/* 图表 */}
      <AreaChart
        genData={genData}
        startTime={startTime}
        endTime={endTime}
        selectedType={['upvotes', 'collections', 'show']}
      />
      <LineCharts
        startTime={startTime}
        endTime={endTime}
        selectedType={['upvotes', 'collections', 'show']}
        genData={genData}
      />
      <LegendChart
        startTime={startTime}
        endTime={endTime}
        genData={genData}
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
        ]}
      />
      <PicChart startTime={startTime} endTime={endTime} genData={picGenData} type="design" />
    </>
  );
}
