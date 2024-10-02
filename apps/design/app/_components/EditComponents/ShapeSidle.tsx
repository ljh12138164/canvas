import { cn } from "@/lib/utils";
import { Tool } from "@/types/Edit";

interface ShapeSidleProps {
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const ShapeSidle = ({ activeTool, onChangeActive }: ShapeSidleProps) => {
  return (
    <aside
      className={cn(
        "z-[100] bg-white border-r w-[300px] h-full flex flex-col",
        activeTool === Tool.Shapes ? "visible" : "hidden"
      )}
    >
      工具
    </aside>
  );
};

export default ShapeSidle;
