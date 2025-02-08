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
import { LabelList, Pie, PieChart } from 'recharts';

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
  type: 'user' | 'design';
}

export function PicChart({ startTime, endTime, genData, type }: PicChartProps) {
  const showTiile = useMemo(() => {
    if (startTime && !endTime) return `${dayjs(startTime).format('YYYY年MM月DD日')}之后的数据`;
    if (startTime && endTime)
      return `从${dayjs(startTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && endTime)
      return `从${dayjs(endTime).format('YYYY年MM月DD日')}到${dayjs(endTime).format('YYYY年MM月DD日')}的数据`;
    if (!startTime && !endTime) return '3个月的数据';
  }, [startTime, endTime]);
  if (genData.reduce((acc, curr) => acc + curr.visitors, 0) === 0)
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>分项统计</CardTitle>
          <CardDescription>显示{showTiile}</CardDescription>
        </CardHeader>
        <CardContent className="h-12">无数据</CardContent>
      </Card>
    );
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>分项统计</CardTitle>
        <CardDescription>显示{showTiile}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={type === 'user' ? chartConfig : chartConfigOf}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="visitors" hideLabel />} />
            <Pie data={genData} dataKey="visitors" nameKey="label">
              <LabelList
                dataKey="label"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig | keyof typeof chartConfigOf) =>
                  type === 'user'
                    ? chartConfig[value as keyof typeof chartConfig]?.label
                    : chartConfigOf[value as keyof typeof chartConfigOf]?.label
                }
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
