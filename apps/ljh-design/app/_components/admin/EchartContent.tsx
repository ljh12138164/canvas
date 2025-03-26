'use client';
import { usePathname } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { AreaChart, type AreaChartType } from '../AdminEchart/AreaChart';
import { LegendChart } from '../AdminEchart/LegendChart';
import { LineCharts } from '../AdminEchart/LineCharts';
import DataTable from './DataTable';
import ViewToggle, { type ViewMode } from './ViewToggle';

interface EchartContentProps {
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
  label: string;
  allData:
    | (
        | {
            id: string;
            name: string;
            userId: string;
            created_at: string;
            updated_at: string;
            history: {
              role: 'user' | 'model';
              imagePrompt?: string | undefined;
              parts: {
                text: string;
              }[];
              type: 'text' | 'image';
            }[];
          }
        | {
            id: string;
            name: string;
            created_at: string;
            updated_at?: string | undefined;
            json: string;
            height: number;
            image: string;
            url?: string | undefined;
            isTemplate?: boolean | undefined;
            width: number;
            userId: string;
          }
        | {
            showId: string;
            userId: string;
            created_at: string;
            updated_at?: string | undefined;
          }
        | {
            id: string;
            created_at: string;
            options: string;
            userId: string;
            name: string;
            clone: boolean;
          }
        | {
            id: string;
            title: string;
            userId: string;
            created_at: string;
            updated_at?: string | undefined;
            explanation: string;
            relativeTheme: string;
            tags: string;
            type: 'template' | 'material';
            relativeMaterial: string;
            clone: number;
          }
        | {
            id: string;
            name: string;
            image?: string | undefined;
            account: string;
            created_at: string;
          }
      )[]
    | undefined;
  columns: {
    key: string;
    label: string;
    render?: (value: any, record: Record<string, any>) => React.ReactNode;
  }[];
}

/**
 * ### 图表内容
 * @param param0 参数
 * @returns 图表内容
 */
const EchartContent = ({
  startTime,
  endTime,
  genData,
  label,
  allData,
  columns,
}: EchartContentProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const pathName = usePathname();
  // 表格列定义

  return (
    <div className="flex flex-col gap-4">
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === 'chart' ? (
        <>
          <AreaChart startTime={startTime} endTime={endTime} genData={genData} label={label} />
          <LineCharts startTime={startTime} endTime={endTime} genData={genData} label={label} />
          <LegendChart startTime={startTime} endTime={endTime} genData={genData} />
        </>
      ) : (
        <>{pathName !== '/admin' && <DataTable data={allData} columns={columns} caption="" />}</>
      )}
    </div>
  );
};

export default EchartContent;
