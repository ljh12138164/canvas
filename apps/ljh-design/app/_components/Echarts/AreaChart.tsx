import { useEchart } from '@/app/_hook/useEcharts';
import { useEffect, useMemo } from 'react';

const AreaChart = () => {
  const option = useMemo(() => {
    return {
      title: {
        text: 'ECharts 入门示例',
      },
    };
  }, []);
  // 获取echart实例
  const { echartRef, charts } = useEchart();
  useEffect(() => {
    if (!echartRef.current) return;
    charts.current?.setOption(option);
  }, [option, charts, echartRef]);

  return <div ref={echartRef} />;
};

export default AreaChart;
