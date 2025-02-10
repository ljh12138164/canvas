'use client';

import { Bar, BarChart, XAxis } from 'recharts';

import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

const chartConfig = {
  datas: {
    label: '使用量',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export type AreaChartType = keyof typeof chartConfig;
interface AreaChartProps {
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
  label: string;
}
export function AreaCoute({ startTime, endTime, genData, label }: AreaChartProps) {
  const total = useMemo(
    () => ({
      datas: genData.reduce((acc, curr) => acc + Number(curr.datas), 0),
    }),
    [genData],
  );
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
      <CardHeader>
        <CardTitle>用户统计</CardTitle>
        <CardDescription>用户统计</CardDescription>
        <section>
          <button
            type="button"
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.datas.toLocaleString()}
            </span>
          </button>
        </section>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={genData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString('zh-CN', {
                  weekday: 'short',
                });
              }}
            />
            <Bar dataKey="running" stackId="a" fill="var(--color-running)" radius={[0, 0, 4, 4]} />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator hideLabel />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
