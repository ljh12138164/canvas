import { useMemoizedFn } from "ahooks";
import { ECharts } from "echarts";
import { useEffect, useRef } from "react";
const arr: ECharts[] = [];
/**
 *
 * @param 自动调整echarts大小
 */
window.addEventListener("reset", () => {
  arr.forEach((item) => {
    item.resize();
  });
});
/**
 * ### 使用echarts
 * @returns
 */
export const useEchart = ({ echarts }: { echarts: ECharts }) => {
  const echartspush = useMemoizedFn((echarts: ECharts) => arr.push(echarts));
  const echartRef = useRef<ECharts>(echarts);
  useEffect(() => {
    arr.push(echarts);
  }, []);
  // 返回echarts 实例
  return echartRef;
};
