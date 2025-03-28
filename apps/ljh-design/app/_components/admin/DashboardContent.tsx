'use client';
import { AreaChart } from '@/app/_components/Echarts/AreaChart';
import { LegendChart } from '@/app/_components/Echarts/LegendChart';
import { LineCharts } from '@/app/_components/Echarts/LineCharts';
import { PicChart } from '@/app/_components/Echarts/PicChart';
import { PicChartCounte } from '@/app/_components/Echarts/PicChartCounte';
import { ScrollArea } from '@/app/_components/ui/scroll-area';

export type GenData = {
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

interface DashboardContentProps {
  genData: GenData;
  picGenData: any[];
  startTime: Date | undefined;
  endTime: Date | undefined;
  loading: boolean;
}

/**
 * ### 仪表盘内容
 * @param param0 参数
 * @returns 仪表盘内容
 */
const DashboardContent = ({
  genData,
  picGenData,
  startTime,
  endTime,
  loading,
}: DashboardContentProps) => {
  if (loading) return null;

  return (
    <ScrollArea className="w-full h-[calc(100dvh-10rem)] px-2 flex flex-col gap-4">
      <main className="flex flex-col gap-4">
        <>
          <section className="flex gap-4 justify-between">
            <PicChartCounte
              startTime={startTime}
              endTime={endTime}
              genData={picGenData}
              type="any"
            />
            <PicChart startTime={startTime} endTime={endTime} genData={picGenData} type="any" />
          </section>
          <section className="flex flex-col gap-4">
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
          </section>
        </>
      </main>
    </ScrollArea>
  );
};

export default DashboardContent;
