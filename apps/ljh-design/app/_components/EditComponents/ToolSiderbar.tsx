import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface ToolSiderbarProps {
  title: string;
  description?: string;
  front?: boolean;
}
const ToolSiderbar = ({ title, description, front }: ToolSiderbarProps) => {
  return (
    <div className=" relative w-full border-b p-4 space-y-1 h-[3rem] group border-r border-y px-1 pr-2 transform  bg-white flex flex-col items-center justify-center">
      {front && (
        <Button
          variant="ghost"
          className="absolute size-4 left-[1rem] top-1/2 -translate-y-1/2"
        >
          <ChevronLeft className="w-full h-full" />
        </Button>
      )}
      <p className="text-sm font-medium"> {title}</p>
      {description && (
        <p className=" text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default ToolSiderbar;
