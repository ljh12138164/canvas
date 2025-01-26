import { Tool } from '@/app/_types/Edit';
import { ArrowLeft } from 'lucide-react';

interface ToolSiderbarProps {
  title: string;
  description?: string;
  front?: boolean;
  scroll?: number[];
  onChangeActive?: (tool: Tool) => void;
}
const ToolSiderbar = ({ title, description, front, onChangeActive }: ToolSiderbarProps) => {
  return (
    <div className=" relative w-full border-b p-4 space-y-1 h-[3rem] group border-r border-y px-1 pr-2 transform  bg-white dark:bg-background flex flex-col items-center justify-center">
      {front && (
        <button
          type="button"
          onClick={() => onChangeActive?.(Tool.Filter)}
          className="absolute size-5 left-[1rem] top-1/2 -translate-y-1/2 flex items-center justify-center hover:bg-slate-50 rounded-sm"
        >
          <ArrowLeft />
        </button>
      )}
      <p className="text-sm font-medium"> {title}</p>
      {description && <p className=" text-xs text-muted-foreground">{description}</p>}
    </div>
  );
};

export default ToolSiderbar;
