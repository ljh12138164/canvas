'use client';

import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';

const geoCoordMap: Record<string, number[]> = {};
const planePath =
  'path://M683.436973 788.16173H317.495351c-28.86573 0-52.279351-23.164541-52.279351-51.753514V296.627892c0-28.575135 23.413622-51.739676 52.279351-51.739676h39.202595v12.938379c0 35.715459 29.267027 64.678054 65.356108 64.678054h156.824216c36.075243 0 65.34227-28.962595 65.342271-64.678054v-12.938379h39.216432c28.86573 0 52.265514 23.164541 52.265513 51.753514v439.794162c0 28.575135-23.399784 51.739676-52.265513 51.739676zM631.143784 425.970162H369.747027a26.015135 26.015135 0 0 0-26.125838 25.876757 26.015135 26.015135 0 0 0 26.139676 25.876757H631.143784a26.015135 26.015135 0 0 0 26.139675-25.876757 26.015135 26.015135 0 0 0-26.153513-25.876757z m0 90.554811H369.747027a26.015135 26.015135 0 0 0-26.125838 25.876757 26.015135 26.015135 0 0 0 26.139676 25.862919H631.143784a26.015135 26.015135 0 0 0 26.139675-25.876757 26.015135 26.015135 0 0 0-26.153513-25.876757z m0 90.540973H369.747027a26.015135 26.015135 0 0 0-26.125838 25.876757 26.015135 26.015135 0 0 0 26.139676 25.876756H631.143784a26.015135 26.015135 0 0 0 26.139675-25.876756 26.015135 26.015135 0 0 0-26.153513-25.876757z m-78.419027-310.451892H448.207568c-28.879568 0-52.279351-23.164541-52.279352-51.739676s23.399784-51.739676 52.279352-51.739675h104.544864c28.86573 0 52.279351 23.164541 52.279352 51.753513 0 28.561297-23.413622 51.725838-52.279352 51.725838z';

const convertData = (data: { name: string; value: number }[]) => {
  const res: Record<'name' & 'value', number[]>[] = [];
  for (let i = 0; i < data.length; i++) {
    const geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: [...geoCoord, Number(data[i].value)], // 将字符串类型的value转换为数字类型并与geoCoord数组合并
      });
    }
  }
  return res;
};
export default function Maps() {
  const [, setEchart] = useState<echarts.ECharts>();
  const chartRef = useRef<HTMLDivElement>(null);

  // 初始化
  useEffect(() => {
    if (!chartRef.current) return;
    fetch('/china.json')
      .then((res) => res.json())
      .then((res) => {
        // @ts-ignore
        echarts.registerMap('china', { geoJSON: res });
        const mapFeatures = echarts.getMap('china').geoJson.features;

        mapFeatures.forEach((v: { properties: { name: string; cp: [] } }) => {
          // 地区名称
          const name = v.properties.name;
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp;
        });
        const chart = echarts.init(chartRef.current);
        setEchart(chart);
        // 示例数据
        const data: { name: string; value: number }[] = [
          { name: '北京', value: 100 },
          { name: '上海', value: 200 },
          { name: '广州', value: 300 },
          { name: '深圳', value: 400 },
          { name: '杭州', value: 250 },
          { name: '成都', value: 350 },
          { name: '武汉', value: 280 },
          { name: '西安', value: 220 },
        ];

        const option: echarts.EChartsCoreOption = {
          backgroundColor: '#070827',
          visualMap: {
            show: true,
            min: 0,
            max: 200,
            left: '10%',
            top: 'bottom',
            calculable: true,
            seriesIndex: [1],
            inRange: {
              color: ['rgba(0, 107, 255, 0.2)', 'rgba(0, 107, 255, 0.8)'], // 蓝绿
            },
          },
          geo: {
            show: true,
            map: 'china',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            roam: false,
            tooltip: {
              show: true,
              formatter: '{b}',
            },
            itemStyle: {
              normal: {
                areaColor: 'rgba(0, 107, 255, 0.3)',
                borderColor: '#006BFF',
                borderWidth: 2,
              },
              emphasis: {
                areaColor: '#4499d0',
              },
              select: {
                color: '#ee6666', // 点击后的颜色   color: '#ff0000', // 扇形选中颜色
                borderColor: '#333', // 边框颜色
                borderWidth: 2,
              },
            },
          },
          series: [
            {
              name: '散点',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: convertData(data),
              symbol: planePath,
              // symbol:'path://M505.468541 505.468541m-505.468541 0a505.468541 505.468541 0 1 0 1010.937081 0 505.468541 505.468541 0 1 0-1010.937081 0Z',
              symbolSize: (val: [number, number, number]) => {
                return val[2] / 10;
              },
              symbolKeepAspect: true,
              itemStyle: {
                normal: {
                  color: '#FFFFFF',
                },
                select: {
                  color: '#ee6666', // 点击后的颜色
                  borderColor: '#333', // 边框颜色
                  borderWidth: 2,
                },
              },
              zlevel: 6,
            },
            {
              type: 'map',
              map: 'china',
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                normal: {
                  show: true,
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    color: '#fff',
                    select: {
                      color: '#ee6666', // 点击后的颜色
                      borderColor: '#333', // 边框颜色
                      borderWidth: 2,
                    },
                  },
                },
              },
              tooltip: {
                show: true,
                formatter: '{b}',
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: '#006BFF',
                  borderColor: '#3B5077',
                },
                emphasis: {
                  areaColor: '#2B91B7',
                  borderColor: '#006BFF',
                  borderWidth: 2,
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 107, 255, 0.5)',
                },
                select: {
                  color: '#ee6666', // 点击后的颜色
                  borderColor: '#333', // 边框颜色
                  backGoundColor: '#006BFF', // 扇形选中颜色
                  borderWidth: 2,
                },
              },
              animation: false,
              data,
            },

            {
              name: 'Top 5',
              // type: 'effectScatter',
              // coordinateSystem: 'geo',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: convertData(data),
              symbolSize: (val: [number, number, number]) => {
                return val[2] / 6;
              },
              symbolKeepAspect: true,
              itemStyle: {
                normal: {
                  color: '#E26851',
                },
                select: {
                  color: '#ee6666', // 点击后的颜色
                  borderColor: '#333', // 边框颜色
                  borderWidth: 2,
                },
              },

              zlevel: 5,
            },
          ],
        };

        chart.setOption(option);

        // 添加窗口大小变化的响应
        window.addEventListener('resize', () => {
          chart.resize();
        });
      });
  }, []);

  return (
    <div className="w-full h-[800px]">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
