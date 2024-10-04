import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";

import { Tool } from "@/types/Edit";
import type { Edit } from "@/types/Edit";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import ShapeTool from "./ShapeTool";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";

interface ShapeSidleProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const ShapeSidle = ({
  activeTool,
  onChangeActive,
  editor,
}: ShapeSidleProps) => {
  return (
    <aside
      className={cn(
        "z-[100] bg-white border-r relative transition w-[300px] h-full flex flex-col",
        activeTool === Tool.Shapes ? "visible" : "hidden"
      )}
    >
      <ToolSiderbar title="形状" description="选择形状工具"></ToolSiderbar>
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool
            Icon={FaCircle}
            onClick={() => editor?.addCircle()}
          ></ShapeTool>
          <ShapeTool
            Icon={FaSquare}
            onClick={() => editor?.addSoftRectangle()}
          ></ShapeTool>
          <ShapeTool
            Icon={FaSquareFull}
            onClick={() => editor?.addRectangle()}
          ></ShapeTool>
          <ShapeTool
            Icon={IoTriangle}
            onClick={() => {
              editor?.addTriangle();
            }}
          ></ShapeTool>
          <ShapeTool
            Icon={IoTriangle}
            onClick={() => {
              editor?.addRotateTriangle();
            }}
            iconClassName="rotate-180"
          ></ShapeTool>
          <ShapeTool
            Icon={FaDiamond}
            onClick={() => {
              editor?.addDiamod();
            }}
            iconClassName="rotate-180"
          ></ShapeTool>
        </div>
      </ScrollArea>
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default ShapeSidle;
