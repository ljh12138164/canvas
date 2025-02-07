import type { UserDataResponseType } from '@/app/_hook/query/useUser';
import { useMemo } from 'react';
import { AreaChart, type AreaChartType } from '../Echarts/AreaChart';
import HeadCard from './HeadCard';
interface UseCardProps {
  userData: UserDataResponseType;
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
}
export default function UseCard({ userData, startTime, endTime, genData }: UseCardProps) {
  // 创建的素材数量
  const totalCreate = useMemo(() => {
    return userData?.material.length ?? 0;
  }, [userData]);
  // 创建的模板数量
  const totalTemplate = useMemo(() => {
    return userData.board.filter((item) => item.isTemplate).length ?? 0;
  }, [userData]);
  // 创建的画板数量
  const totalBoard = useMemo(() => {
    return userData.board.filter((item) => !item.isTemplate).length ?? 0;
  }, [userData]);

  return (
    <>
      <HeadCard
        data={[
          { title: '创建的画板', total: totalBoard },
          { title: '创建的模板', total: totalTemplate },
          { title: '创建的素材', total: totalCreate },
        ]}
      />
      {/* 图表 */}
      <AreaChart
        genData={genData}
        startTime={startTime}
        endTime={endTime}
        selectedType={['templates', 'material', 'board']}
      />
    </>
  );
}
