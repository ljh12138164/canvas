import { useMemoizedFn } from 'ahooks';
import type { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
//  @ts-ignore
const echartsArr = new Set<ECharts>();
/**
 *
 * @param 自动调整echarts大小
 */
window.addEventListener('reset', () => {
  [...echartsArr].forEach((item) => {
    item.resize();
  });
});

/**
 * ### 使用echarts
 * @returns
 */
export const useEchart = () => {
  const echartspush = useMemoizedFn((echarts: ECharts) => echartsArr.add(echarts));
  const echartRef = useRef<HTMLDivElement | null>(null);
  const charts = useRef<ECharts | null>(null);
  useEffect(() => {
    if (!echartRef.current) return;
    charts.current = echarts.init(echartRef.current);
    // 添加到echartsArr
    echartspush(charts.current);
    return () => {
      if (!charts.current) return;
      echartsArr.delete(charts.current);
    };
  }, [echartspush]);
  // 返回echarts 实例
  return { echartRef, charts };
};
