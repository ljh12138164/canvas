import { useMemoizedFn } from 'ahooks';
import type { LineSeriesOption, PieSeriesOption } from 'echarts/charts';
import { LineChart, PieChart } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';

// 定义图表配置类型
export type ECOption = echarts.ComposeOption<
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption
  | LineSeriesOption
  | PieSeriesOption
>;

// 注册必需的组件
echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
]);

const echartsArr = new Set<echarts.ECharts>();

// 窗口大小改变时自动调整图表大小
window.addEventListener('resize', () => {
  [...echartsArr].forEach((chart) => {
    chart.resize();
  });
});

interface UseEchartProps {
  // @ts-ignore
  options: ECOption;
}

/**
 * ECharts Hook
 */
export const useEchart = ({ options }: UseEchartProps) => {
  const echartspush = useMemoizedFn((chart: echarts.ECharts) => echartsArr.add(chart));
  const echartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!echartRef.current) return;

    // 初始化图表
    chartInstance.current = echarts.init(echartRef.current);
    chartInstance.current.setOption(options);
    echartspush(chartInstance.current);

    return () => {
      if (chartInstance.current) {
        echartsArr.delete(chartInstance.current);
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [echartspush, options]);

  return { echartRef, chartInstance };
};
