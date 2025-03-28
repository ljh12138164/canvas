'use client';

import { useMap } from '@/hooks/use-map';
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';

const geoCoordMap: Record<string, number[]> = {};

let allData: { name: string; value?: number }[] = [
  {
    name: '北京',
  },
  {
    name: '天津',
  },
  {
    name: '上海',
  },
  {
    name: '重庆',
  },
  {
    name: '河北',
  },
  {
    name: '河南',
  },
  {
    name: '云南',
  },
  {
    name: '辽宁',
  },
  {
    name: '黑龙江',
  },
  {
    name: '湖南',
  },
  {
    name: '安徽',
  },
  {
    name: '山东',
  },
  {
    name: '新疆',
  },
  {
    name: '江苏',
  },
  {
    name: '浙江',
  },
  {
    name: '江西',
  },
  {
    name: '湖北',
  },
  {
    name: '广西',
  },
  {
    name: '甘肃',
  },
  {
    name: '山西',
  },
  {
    name: '内蒙古',
  },
  {
    name: '陕西',
  },
  {
    name: '吉林',
  },
  {
    name: '福建',
  },
  {
    name: '贵州',
  },
  {
    name: '广东',
  },
  {
    name: '青海',
  },
  {
    name: '西藏',
  },
  {
    name: '四川',
  },
  {
    name: '宁夏',
  },
  {
    name: '海南',
  },
  {
    name: '台湾',
  },
  {
    name: '香港',
  },
  {
    name: '澳门',
  },
];

for (let i = 0; i < allData.length; i++) {
  allData[i].value = Math.round(Math.random() * 100);
}

export default function Maps() {
  const [echart, setEchart] = useState<echarts.ECharts>();
  const [code, setCode] = useState<number>(0);
  const { data, isLoading } = useMap(code);
  const chartRef = useRef<HTMLDivElement>(null);
  const tiemRef = useRef<NodeJS.Timeout | string | number | undefined>(undefined);
  const mapIndex = useRef<Record<string, number>>(null);

  // 初始化
  useEffect(() => {
    if (!chartRef.current) return;
    const abort = new AbortController();
    const chart = echarts.init(chartRef.current);
    setEchart(chart);
    // 添加窗口大小变化的响应
    window.addEventListener(
      'resize',
      () => {
        chart.resize();
      },
      { signal: abort.signal },
    );
    return () => {
      abort.abort();
      echart?.dispose();
    };
  }, []);

  useEffect(() => {
    echart?.on('click', (params) => {
      clearTimeout(tiemRef.current);
      //由于单击事件和双击事件冲突，故单击的响应事件延迟250毫秒执行
      if (code) return;
      tiemRef.current = setTimeout(() => {
        const name = params.name; //地区name
        if (mapIndex.current?.[name]) {
          setCode(mapIndex.current[name]);
        }
      }, 250);
      echart.on('dblclick', () => {
        //当双击事件发生时，清除单击事件，仅响应双击事件
        clearTimeout(tiemRef.current);
        //返回全国地图
        setCode(0);
      });
    });
    return () => {
      clearTimeout(tiemRef.current);
      echart?.off('click');
      echart?.off('dblclick');
    };
  }, [echart, code]);

  useEffect(() => {
    if (isLoading || !echart) return;
    // @ts-ignore
    echarts.registerMap(`${code}` ? `${code}` : 'china', { geoJSON: data });
    const mapFeatures = echarts.getMap(`${code}` ? `${code}` : 'china').geoJson.features;
    const objs: { name: string }[] = [];
    mapFeatures.forEach((v: { properties: { name: string; cp: [] } }) => {
      // 地区名称
      const name = v.properties.name;
      // 地区经纬度
      geoCoordMap[name] = v.properties.cp;
      objs.push({
        name,
      });
    });
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    allData = objs;
    // 更新数据
    for (let i = 0; i < allData.length; i++) {
      const numbers = Math.round(Math.random() * 100);
      allData[i].value = numbers;
      max = Math.max(numbers, max);
      min = Math.min(numbers, min);
    }
    const option: echarts.EChartsCoreOption = {
      tooltip: {
        show: true,
        formatter: (params: { data: { value: number }; name: string }) => {
          if (params.data) return `${params.name}：${params.data.value}`;
        },
      },
      graphic: {
        elements: [
          {
            type: 'text',
            right: 20,
            top: 20,
            style: {
              text: '返回全国',
              fontSize: 14,
              fill: '#1890ff',
              cursor: 'pointer',
            },
            onclick: () => {
              setCode(0);
            },
            invisible: !code, // 只在非全国地图时显示
          },
          {
            type: 'rect',
            right: 20,
            top: 20,
            style: {
              board: '10px',
            },
            onclick: () => {
              setCode(0);
            },
            invisible: !code, // 只在非全国地图时显示
          },
        ],
      },
      visualMap: {
        type: 'continuous',
        text: [max, min],
        showLabel: true,
        orient: 'horizontal',
        bottom: '6%',
        left: 'center', // 修改为居中
        min: 0,
        max: 100,
        show: true,
        inRange: {
          color: ['#40a9ff', '#1890ff', '#096dd9', '#0050b3'],
        },
        splitNumber: 0,
      },
      series: [
        {
          name: 'MAP',
          type: 'map',
          mapType: `${code}` ? `${code}` : 'china',
          selectedMode: 'false', //是否允许选中多个区域
          // label: {
          //   normal: {
          //     show: true,
          //   },
          //   emphasis: {
          //     show: true,
          //   },
          // },
          roam: true,
          data: allData,
        },
      ],
    };
    echart.setOption(option);
  }, [data, isLoading, echart, code]);

  useEffect(() => {
    if (data && !isLoading && !mapIndex.current && code !== 0) return;
    if (data?.features) {
      data.features.forEach((v: { properties: { name: string; code: number } }) => {
        // 地区名称
        const name = v.properties.name;
        // 地区经纬度
        mapIndex.current = { ...mapIndex.current, [name]: v.properties.code };
      });
    }
  }, [data, isLoading, code]);

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-hidden flex relative">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
