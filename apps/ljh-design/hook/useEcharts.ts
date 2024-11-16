import { useMemoizedFn } from "ahooks";
import { ECharts } from "echarts";
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
export const useEchart = () => {
  const echartspush = useMemoizedFn((echarts: ECharts) => arr.push(echarts));
  return {
    echartspush,
  };
};
