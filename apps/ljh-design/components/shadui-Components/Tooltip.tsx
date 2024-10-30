import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
interface TooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}
const TooltipComponents = ({
  label,
  children,
  side,
  sideOffset,
  align,
  alignOffset,
}: TooltipProps) => {
  return (
    // @ts-ignore
    <TooltipProvider>
      {/* @ts-ignore */}
      <Tooltip delayDuration={100}>
        {/* @ts-ignore */}
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-white bg-slate-800 border-slate-800 z-[1000]"
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <p className="font-semibold capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponents;