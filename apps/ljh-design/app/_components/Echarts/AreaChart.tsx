import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { useEchart } from "@/app/_hook/useEcharts";

const AreaChart = () => {
  const echartRef = useRef<HTMLDivElement>(null);

  const option = useMemo(() => {
    return {
      title: {
        text: "ECharts 入门示例",
      },
    };
  }, []);
  const { echartspush } = useEchart();
  useEffect(() => {
    if (!echartRef.current) return;
    const chart = echarts.init(echartRef.current);
    chart.setOption(option);
    echartspush(chart);
  }, [echartspush, option]);

  return <div ref={echartRef}></div>;
};

export default AreaChart;
