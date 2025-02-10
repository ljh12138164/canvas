'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

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
} satisfies ChartConfig;
const chartConfigOf = {
  upvotes: {
    label: '点赞',
    color: 'hsl(var(--chart-4))',
  },
  collections: {
    label: '收藏',
    color: 'hsl(var(--chart-5))',
  },
  show: {
    label: '发布',
    color: 'hsl(var(--chart-6))',
  },
} satisfies ChartConfig;
const anyConfig = {
  ...chartConfig,
  ...chartConfigOf,
};

interface PicChartProps {
  startTime: Date | undefined;
  endTime: Date | undefined;
  //   selectedType: PicChartType[];
  genData: {
    label: string;
    type: string;
    visitors: number;
    fill: string;
  }[];
  type: 'user' | 'design' | 'any';
}
export function PicChartCounte({ startTime, endTime, genData, type }: PicChartProps) {
  const totalVisitors = React.useMemo(() => {
    return genData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [genData]);

  const showTiile = React.useMemo(() => {
    if (startTime && !endTime) return `${dayjs(startTime).format('YYYY年MM月DD日')}之后的数据`;
    if (startTime && endTime)
      return `从${dayjs(startTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && endTime)
      return `从${dayjs(endTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && !endTime) return '1个月的数据';
  }, [startTime, endTime]);
  const config = React.useMemo(() => {
    if (type === 'any') {
      return anyConfig;
    }
    return type === 'user' ? chartConfig : chartConfigOf;
  }, [type]);

  if (genData.reduce((acc, curr) => acc + curr.visitors, 0) === 0)
    return (
      <Card className="flex flex-col w-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>分项统计</CardTitle>
          <CardDescription>显示{showTiile}</CardDescription>
        </CardHeader>
        <CardContent className="h-12">无数据</CardContent>
      </Card>
    );
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>分项统计</CardTitle>
        <CardDescription>显示{showTiile}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={genData} dataKey="visitors" nameKey="label" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          总活动量
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
