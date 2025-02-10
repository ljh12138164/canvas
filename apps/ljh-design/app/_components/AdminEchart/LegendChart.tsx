'use client';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/_components/ui/chart';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
  datas: {
    label: '使用量',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export type AreaChartType = keyof typeof chartConfig;
interface AreaChartProps {
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
}

export function LegendChart({ startTime, endTime, genData }: AreaChartProps) {
  const showTiile = useMemo(() => {
    if (startTime && !endTime) return `${dayjs(startTime).format('YYYY年MM月DD日')}之后的数据`;
    if (startTime && endTime)
      return `从${dayjs(startTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && endTime)
      return `从${dayjs(endTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && !endTime) return '1个月的数据';
  }, [startTime, endTime]);
  if (genData.length === 0)
    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>堆叠面积图</CardTitle>
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
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>堆叠面积图</CardTitle>
          <CardDescription>显示{showTiile}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={genData}>
            <defs>
              <linearGradient id="fillChart1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="datas" fill="hsl(var(--chart-3))" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
