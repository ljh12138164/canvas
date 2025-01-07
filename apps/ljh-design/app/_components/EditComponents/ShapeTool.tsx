import type { IconType } from 'react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/ui/tooltip';
import { cn } from '@/app/_lib/utils';
interface ShapeToolProps {
  Icon: IconType;
  onClick: () => void;
  iconClassName?: string;
  title: string;
}
const ShapeTool = ({
  Icon,
  onClick,
  iconClassName,
  title,
}: ShapeToolProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            key={title}
            onClick={onClick}
            className='aspect-square border rounded-md p-5 '
          >
            <Icon className={cn('h-full w-full', iconClassName)}></Icon>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShapeTool;
