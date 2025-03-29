'use client';

import { useDashboardList } from '@/app/_hook/query/useAdmin';
import { useMapData } from '@/app/_hook/query/useMap';
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';

const geoCoordMap: Record<string, number[]> = {};

export default function Maps({
  startTime,
  endTime,
}: { startTime: Date | undefined; endTime: Date | undefined }) {
  const [echart, setEchart] = useState<echarts.ECharts>();
  const [code, setCode] = useState<number>(0);
  const { data, isLoading } = useMapData(code);
  const [dataStats, setDataStats] = useState<{ total: number; max: number; avg: number }>({
    total: 0,
    max: 0,
    avg: 0,
  });

  const { data: dashboardData } = useDashboardList(startTime, endTime, code);
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
    if (isLoading || !echart || !dashboardData) return;

    // @ts-ignore
    echarts.registerMap(`${code}` ? `${code}` : 'china', { geoJSON: data });
    const mapFeatures = echarts.getMap(`${code}` ? `${code}` : 'china').geoJson.features;
    const objs: { name: string; code: number; value: number }[] = [];
    const majorCities: { name: string; value: number[]; data: number; cityType?: string }[] = [];

    mapFeatures.forEach((v: { properties: { name: string; cp: []; code: number } }) => {
      // 地区名称
      const name = v.properties.name;
      const code = v.properties.code;
      // 地区经纬度
      geoCoordMap[name] = v.properties.cp;
      objs.push({
        name,
        code,
        value: 0,
      });
      // 添加主要城市数据点
      // @ts-ignore
      if (v.properties.cp && Array.isArray(v.properties.cp) && v.properties.cp.length === 2) {
        majorCities.push({
          name,
          value: v.properties.cp,
          data: 0,
          cityType: code % 5 === 0 ? '主要城市' : '一般城市', // 简单逻辑示例，实际应根据城市级别确定
        });
      }
    });
    const filterData = dashboardData.filter((item) => item.region);

    // 将仪表盘数据添加到地图数据中
    filterData.forEach((item) => {
      // 如果是中国地图
      if (!code) {
        const codes = item.region?.split(',')?.[0];
        const regionObj = objs.find((items) => {
          return items.code === Number(codes);
        });
        if (regionObj) {
          regionObj.value++;

          // 为城市数据点也更新数据
          const city = majorCities.find((city) => city.name === regionObj.name);
          if (city) {
            city.data++;
          }
        }
      } else {
        // 如果是嵌套的路由
        const lastCode = item.region?.split(',')?.[1];
        const regionObj = objs.find((items) => {
          return items.code === Number(lastCode);
        });
        if (regionObj) {
          regionObj.value++;

          // 为城市数据点也更新数据
          const city = majorCities.find((city) => city.name === regionObj.name);
          if (city) {
            city.data++;
          }
        }
      }
    });

    // 计算数据统计信息
    const values = objs.map((o) => o.value);
    const totalValue = values.reduce((sum, val) => sum + val, 0);
    const maxValue = Math.max(...values);
    const avgValue = totalValue / (values.length || 1);

    setDataStats({
      total: totalValue,
      max: maxValue,
      avg: Math.round(avgValue * 100) / 100,
    });

    const max = maxValue;
    const min = Math.min(...objs.map((item) => item.value || 0));

    // 获取主题颜色
    const isDarkMode = document.documentElement.classList.contains('dark');
    const backgroundColor = isDarkMode ? '#1f2937' : '#f9fafb';
    const borderColor = isDarkMode ? '#4b5563' : '#e5e7eb';
    const textColor = isDarkMode ? '#f9fafb' : '#111827';
    const areaColors = isDarkMode
      ? ['#73b9ff', '#3b82f6', '#2563eb', '#1d4ed8']
      : ['#bfdbfe', '#60a5fa', '#3b82f6', '#2563eb'];

    const option: echarts.EChartsCoreOption = {
      backgroundColor: backgroundColor,
      tooltip: {
        show: true,
        trigger: 'item',
        backgroundColor: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: textColor,
        },
        formatter: (params: any) => {
          if (params.seriesType === 'map') {
            return `<div style="font-weight: bold">${params.name}</div>
                    <div>数量：${params.data.value}</div>`;
          }
          if (params.seriesType === 'effectScatter') {
            return `<div style="font-weight: bold">${params.name}</div>
                    <div>数量：${params.data.data}</div>
                    <div>类型：${params.data.cityType || '城市'}</div>`;
          }
          return '';
        },
        extraCssText:
          'box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-radius: 4px; padding: 10px;',
      },
      // 添加数据总览标题
      title: {
        text: code ? `${objs[0]?.name || ''}地区数据分布` : '全国数据分布',
        subtext: `总数据量: ${dataStats.total} | 最大值: ${dataStats.max}`,
        left: 20,
        top: 20,
        textStyle: {
          color: textColor,
          fontSize: 18,
          fontWeight: 'bold',
        },
        subtextStyle: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: 12,
        },
      },
      // 添加地图工具栏
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
        iconStyle: {
          borderColor: textColor,
        },
      },
      graphic: {
        elements: [
          {
            type: 'rect',
            z: 100,
            right: 20,
            top: 80,
            style: {
              width: 80,
              height: 30,
              fill: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.8)',
              stroke: isDarkMode ? '#2563eb' : '#2563eb',
              lineWidth: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowOffsetX: 2,
              shadowOffsetY: 2,
              borderRadius: 5,
            },
            onclick: () => {
              setCode(0);
            },
            invisible: !code, // 只在非全国地图时显示
          },
          {
            type: 'text',
            z: 100,
            right: 5,
            top: 10,
            style: {
              text: '返回全国',
              fontSize: 14,
              fontWeight: 'bold',
              fill: '#000',
              cursor: 'pointer',
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
        text: ['高', '低'],
        showLabel: true,
        orient: 'horizontal',
        bottom: '5%',
        left: 'center',
        min: 0,
        max: max || 100,
        show: true,
        inRange: {
          color: areaColors,
        },
        textStyle: {
          color: textColor,
        },
        formatter: (value: number) => {
          return value.toFixed(0);
        },
        splitNumber: 0,
        textGap: 10,
        itemWidth: 20,
        itemHeight: 140,
        padding: [5, 10],
      },
      // 添加图例
      legend: {
        data: ['地区数据', '城市数据点'],
        bottom: 10,
        left: 10,
        textStyle: {
          color: textColor,
        },
        selectedMode: 'multiple',
      },
      geo: {
        map: `${code}` ? `${code}` : 'china',
        roam: true,
        zoom: 1.2,
        center: code ? undefined : [104, 36],
        silent: false,
        itemStyle: {
          normal: {
            borderColor: borderColor,
            borderWidth: 0.5,
            areaColor: isDarkMode ? '#1e293b' : '#edf2f7',
          },
        },
        emphasis: {
          itemStyle: {
            areaColor: isDarkMode ? '#3182ce' : '#90cdf4',
          },
        },
      },
      series: [
        {
          name: '地区数据',
          type: 'map',
          mapType: `${code}` ? `${code}` : 'china',
          selectedMode: false,
          roam: true,
          zoom: 1.2,
          center: code ? undefined : [104, 36],
          data: objs,
          itemStyle: {
            areaColor: isDarkMode ? '#1e293b' : '#edf2f7',
            borderColor: borderColor,
            borderWidth: 0.5,
          },
          emphasis: {
            itemStyle: {
              areaColor: isDarkMode ? '#3182ce' : '#90cdf4',
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              borderWidth: 1,
            },
            label: {
              color: '#fff',
              fontWeight: 'bold',
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 5,
            },
          },
          label: {
            show: true,
            color: textColor,
            fontWeight: 'normal',
            fontSize: 12,
            formatter: (params: { name: string; value: number }) => {
              return params.value > 0 ? params.name : '';
            },
          },
          animationDuration: 1000,
          animationEasingUpdate: 'quinticInOut',
          universalTransition: true,
        },
        // 添加散点图表示主要城市
      ],
      animation: true,
      animationThreshold: 2000,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: 0,
    };
    echart.setOption(option);
  }, [data, isLoading, echart, code, dashboardData]);

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
    <div className="w-full h-[calc(100dvh-150px)] overflow-hidden flex relative border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
