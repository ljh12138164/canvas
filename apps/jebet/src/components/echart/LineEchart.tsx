import { type ECOption, useEchart } from '@/hooks/useEcharts';
import { getData } from '@/lib/echart';
import type { WorkspaceResponseType } from '@/server/hooks/board';
import type { Member, Task } from '@/types/workspace';
import { useMemo } from 'react';
/**
 *  ### 折线图---时间轴----数量
 * @returns
 */
export const LineEchart = ({
  date,
  workspace,
  types,
}: {
  date: number;
  workspace: WorkspaceResponseType[0];
  types: keyof WorkspaceResponseType[0];
}) => {
  const arrDate = useMemo(() => getData(date), [date]);
  const Workspacedata = useMemo(() => {
    return arrDate.map((item) => {
      return {
        date: item,
        value: 0,
      };
    });
  }, [arrDate]);
  (workspace[types] as Task[] | Member[]).forEach((item) => {
    const time = new Date().getTime() - new Date(item.created_at).getTime();
    if (
      new Date().getTime() - new Date(item.created_at).getTime() <
      new Date(date * 24 * 60 * 60 * 1000).getTime()
    ) {
      const dates = Math.floor(time / (24 * 60 * 60 * 1000));
      Workspacedata[dates].value++;
    }
  });
  const options: ECOption = useMemo(() => {
    return {
      // 横轴
      xAxis: {
        type: 'category',
        data: arrDate,
        boundaryGap: false,
      },
      // 纵轴
      yAxis: {
        type: 'value',
      },
      // 数据
      series: [
        {
          data: Workspacedata.map((item) => item.value),
          type: 'line',
          areaStyle: {
            color: '#03863a',
          },
        },
      ],
      // 提示框
      tooltip: {
        // 触发
        trigger: 'axis',
        // 十字线
        axisPointer: {
          // 十字线
          type: 'cross',
          label: {
            backgroundColor: '#220aaa',
          },
        },
      },
    };
  }, [arrDate, Workspacedata]);
  const { echartRef } = useEchart({ options });
  return <div ref={echartRef} className="w-full h-full min-h-[300px]" />;
};
