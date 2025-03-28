'use client';
import AdminPeding from '@/app/_components/admin/AdminPeding';
import DashboardContent from '@/app/_components/admin/DashboardContent';
import DateContent from '@/app/_components/admin/DateContent';

import { useDashboardList } from '@/app/_hook/query/useAdmin';
import { useIsAdmin } from '@/app/_hook/useAdmin';
import { useDatePicker } from '@/app/_store/datePicker';
import { useEffect, useMemo, useState } from 'react';
type GenData = {
  filterData: {
    date: string;
    templates: number;
    material: number;
    board: number;
    upvotes: number;
    collections: number;
    show: number;
  }[];
  totalUser: number;
  totalLike: number;
  totalCollect: number;
  totalDesign: number;
  totalTemplate: number;
  totalBoard: number;
  totalMaterial: number;
};
const Page = () => {
  const { isLoading } = useIsAdmin({ type: 'logout' });
  const { startTime, endTime, dates, loading: dateLoading } = useDatePicker();
  const { data, isPending } = useDashboardList(startTime, endTime);
  const [worker, setWorker] = useState<Worker>();
  const [genData, setGenData] = useState<GenData>({} as GenData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const worker = new Worker(new URL('@/app/_worker/genData.ts', import.meta.url));
    setWorker(worker);
    // 接收数据
    worker.onmessage = (e: MessageEvent<GenData>) => {
      setGenData(e.data);
      setLoading(false);
    };
    return () => {
      worker.terminate();
    };
  }, []);
  useEffect(() => {
    if (!data || dateLoading) return;
    if (worker) {
      // 更新数据
      worker.postMessage({ data: dates, userData: data });
      setLoading(true);
    }
  }, [data, worker, dateLoading]);

  const picGenData = useMemo(() => {
    return [
      {
        label: '画板',
        type: 'board',
        visitors: genData?.totalBoard,
        fill: 'hsl(var(--chart-1))',
      },
      {
        label: '模板',
        type: 'templates',
        visitors: genData?.totalTemplate,
        fill: 'hsl(var(--chart-2))',
      },
      {
        label: '素材',
        type: 'material',
        visitors: genData?.totalMaterial,
        fill: 'hsl(var(--chart-3))',
      },
      {
        label: '点赞',
        type: 'upvotes',
        visitors: genData?.totalLike,
        fill: 'hsl(var(--chart-4))',
      },
      {
        label: '收藏',
        type: 'collections',
        visitors: genData?.totalCollect,
        fill: 'hsl(var(--chart-5))',
      },
      {
        label: '发布',
        type: 'show',
        visitors: genData?.totalDesign,
        fill: 'hsl(var(--chart-6))',
      },
    ];
  }, [genData]);
  if (isPending || isLoading) return <AdminPeding title="仪表盘统计" />;
  return (
    <DateContent title="仪表盘统计" main>
      <DashboardContent
        genData={genData}
        picGenData={picGenData}
        startTime={startTime}
        endTime={endTime}
        loading={loading}
      />
    </DateContent>
  );
};

export default Page;
