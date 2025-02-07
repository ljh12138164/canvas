import type { UserDataResponseType } from '@/app/_hook/query/useUser';
import { useMemo } from 'react';
import { AreaChart, type AreaChartType } from '../Echarts/AreaChart';
import HeadCard from './HeadCard';
interface DesignCardProps {
  userData: UserDataResponseType;
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
}

export default function DesignCard({ userData, startTime, endTime, genData }: DesignCardProps) {
  const totalLike = useMemo(() => {
    return userData?.show.map((item) => item.upvotes.length).reduce((a, b) => a + b, 0) ?? 0;
  }, [userData]);
  const totalCollect = useMemo(() => {
    return userData?.show.map((item) => item.collections.length).reduce((a, b) => a + b, 0) ?? 0;
  }, [userData]);
  const totalDesign = useMemo(() => {
    return userData?.show.length ?? 0;
  }, [userData]);
  return (
    <>
      <HeadCard
        data={[
          { title: '话题总点赞', total: totalLike },
          { title: '话题总收藏', total: totalCollect },
          { title: '话题总发布', total: totalDesign },
        ]}
      />
      {/* 图表 */}
      <AreaChart
        genData={genData}
        startTime={startTime}
        endTime={endTime}
        selectedType={['upvotes', 'collections', 'show']}
      />
    </>
  );
}
