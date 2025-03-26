'use client';
import { Button } from '@/app/_components/ui/button';
import { BarChart3, List } from 'lucide-react';

export type ViewMode = 'chart' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * ### 视图切换
 * @param param0 参数
 * @returns 视图切换
 */
const ViewToggle = ({ viewMode, setViewMode }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant={viewMode === 'chart' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('chart')}
        className="flex items-center gap-1"
      >
        <BarChart3 className="w-4 h-4" />
        <span>图表</span>
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('list')}
        className="flex items-center gap-1"
      >
        <List className="w-4 h-4" />
        <span>列表</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
