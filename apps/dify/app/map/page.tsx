'use client';

import Maps from '@/components/map/map';
// import * as echarts from 'echarts';
// import { useEffect, useRef } from 'react';

export default function Page() {
  // const chartRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!chartRef.current) return;

  //   const chart = echarts.init(chartRef.current);

  //   // 示例数据
  //   const data = [
  //     { name: '北京', value: 100 },
  //     { name: '上海', value: 200 },
  //     { name: '广州', value: 300 },
  //     { name: '深圳', value: 400 },
  //   ];

  //   const option = {
  //     title: {
  //       text: '中国地图数据展示',
  //       left: 'center',
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{b}<br/>数值：{c}',
  //     },
  //     visualMap: {
  //       min: 0,
  //       max: 500,
  //       left: 'left',
  //       top: 'bottom',
  //       text: ['高', '低'],
  //       calculable: true,
  //       inRange: {
  //         color: ['#e0ffff', '#006edd'],
  //       },
  //     },
  //     series: [
  //       {
  //         name: '数据',
  //         type: 'map',
  //         map: 'china',
  //         roam: true,
  //         emphasis: {
  //           label: {
  //             show: true,
  //           },
  //         },
  //         data: data,
  //       },
  //     ],
  //   };

  //   chart.setOption(option);

  //   return () => {
  //     chart.dispose();
  //   };
  // }, []);

  return (
    <div className="w-full h-[800px]">
      {/* <div ref={chartRef} className="w-full h-full" /> */}
      <Maps />
    </div>
  );
}
