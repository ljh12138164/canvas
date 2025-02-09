'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/_components/ui/chart';
import dayjs from 'dayjs';

const chartConfig = {
  templates: {
    label: '模板',
    color: 'hsl(var(--chart-1))',
  },
  material: {
    label: '素材',
    color: 'hsl(var(--chart-2))',
  },
  board: {
    label: '画板',
    color: 'hsl(var(--chart-3))',
  },
  upvotes: {
    label: '点赞',
    color: 'hsl(var(--chart-1))',
  },
  collections: {
    label: '收藏',
    color: 'hsl(var(--chart-2))',
  },
  show: {
    label: '发布',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export type AreaChartType = keyof typeof chartConfig;
interface AreaChartProps {
  startTime: Date | undefined;
  endTime: Date | undefined;
  selectedType: AreaChartType[];
  genData: Record<AreaChartType | 'date', number | string>[];
}
export function LineCharts({ startTime, endTime, selectedType, genData }: AreaChartProps) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>(selectedType[0]);

  const total = React.useMemo(
    () => ({
      board: genData.reduce((acc, curr) => acc + Number(curr.board), 0),
      templates: genData.reduce((acc, curr) => acc + Number(curr.templates), 0),
      material: genData.reduce((acc, curr) => acc + Number(curr.material), 0),
      upvotes: genData.reduce((acc, curr) => acc + Number(curr.upvotes), 0),
      collections: genData.reduce((acc, curr) => acc + Number(curr.collections), 0),
      show: genData.reduce((acc, curr) => acc + Number(curr.show), 0),
    }),
    [genData],
  );
  const showTiile = React.useMemo(() => {
    if (startTime && !endTime) return `${dayjs(startTime).format('YYYY年MM月DD日')}之后的数据`;
    if (startTime && endTime)
      return `从${dayjs(startTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && endTime)
      return `从${dayjs(endTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && !endTime) return '3个月的数据';
  }, [startTime, endTime]);
  if (genData.length === 0)
    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>使用统计折线图</CardTitle>
            <CardDescription>显示{showTiile}</CardDescription>
          </div>
        </CardHeader>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">没有数据</p>
        </div>
      </Card>
    );
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>使用统计折线图</CardTitle>
          <CardDescription>显示{showTiile}</CardDescription>
        </div>
        <div className="flex">
          {selectedType.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                type="button"
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={genData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
