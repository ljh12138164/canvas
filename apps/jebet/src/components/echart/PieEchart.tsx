import { useEchart } from '@/hooks/useEcharts';
import type { WorkspaceResponseType } from '@/server/hooks/board';
import { TaskStatus } from '@/types/workspace';
import type { Member, Task } from '@/types/workspace';
import type { EChartsOption } from 'echarts';
import { useMemo } from 'react';

export const PieEchart = ({
  date,
  workspace,
  types,
}: {
  date: number;
  workspace: WorkspaceResponseType[0];
  types: keyof WorkspaceResponseType[0];
}) => {
  const Workspacedata: { name: string; value: number }[] = useMemo(() => {
    return Object.values(TaskStatus).map((item) => {
      return {
        name: item,
        value: 0,
      };
    });
  }, []);
  (workspace[types] as Task[] | Member[]).forEach((item) => {
    const time = new Date().getTime() - new Date(item.created_at).getTime();
    if (time < new Date(date * 24 * 60 * 60 * 1000).getTime()) {
      if (types === 'tasks') {
        const find = Workspacedata?.find((items) => items?.name === (item as Task).status);
        if (find) {
          find.value++;
        }
      }
    }
  });

  const options: EChartsOption = useMemo(() => {
    return {
      // 提示框
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      // 图例
      legend: {
        bottom: 10,
        left: 'center',
        data: [TaskStatus.BACKLOG, TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.IN_REVIEW],
      },
      // 数据
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: Workspacedata.filter((item) => item.value > 0),
          // 高亮
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }, [Workspacedata]);
  const { echartRef } = useEchart({ options });
  return <div ref={echartRef} className="w-full h-full min-h-[300px]" />;
};
