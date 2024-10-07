import TooltipComponents from "@/components/shadui-Components/Tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Tool } from "@/types/Edit";
import { useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";
interface ToolBarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
}
const Tools = ({ editor, activeTool, onChangeActiveTool }: ToolBarProps) => {
  const selectedObject = editor?.canvas?.getActiveObject();
  //获取属性
  const getProperty = (property: string) => {
    if (!selectedObject) return null;
    return selectedObject.get(property);
  };
  //获取颜色和
  const fillColor = getProperty("fill");
  const storkeColor = editor?.getActiveStokeColor();

  const fillColor2 = editor?.fillColor;
  const [properties, setProperties] = useState({ fillColor });
  if (!editor?.selectedObject?.length) {
    return (
      <section className="h-[3rem] p-2 bg-white items-center flex w-full z-[50]" />
    );
  }
  return (
    <section className="h-[3rem] p-2 space-x-4 bg-white items-center flex w-full z-[50]">
      <div className="flex items-center h-full justify-center gap-2">
        <TooltipComponents
          label="颜色"
          side="bottom"
          sideOffset={5}
          key={Tool.Fill}
        >
          <Button
            onClick={() => onChangeActiveTool(Tool.Fill)}
            size="icon"
            variant="ghost"
            className={cn(activeTool === Tool.Fill && "bg-gray-100")}
          >
            <div
              className={`rounded-small size-4 border `}
              style={{ backgroundColor: fillColor ? fillColor : "black" }}
            />
          </Button>
        </TooltipComponents>
        <TooltipComponents
          label="边框颜色"
          side="bottom"
          sideOffset={5}
          key={Tool.StrokeColor}
        >
          <Button
            onClick={() => onChangeActiveTool(Tool.StrokeColor)}
            size="icon"
            variant="ghost"
            className={cn(activeTool === Tool.StrokeColor && "bg-gray-100")}
          >
            <div
              className={`rounded-small size-4 border bg-white `}
              style={{
                border: storkeColor
                  ? `2px solid ${storkeColor}`
                  : "2px solid black",
              }}
            />
          </Button>
        </TooltipComponents>
        <TooltipComponents
          label="边框宽度"
          side="bottom"
          sideOffset={5}
          key={Tool.StrokeWidth}
        >
          <Button
            onClick={() => onChangeActiveTool(Tool.StrokeWidth)}
            size="icon"
            variant="ghost"
            className={cn(activeTool === Tool.StrokeWidth && "bg-gray-100")}
          >
            <BsBorderWidth className="size-4"></BsBorderWidth>
          </Button>
        </TooltipComponents>
        <TooltipComponents
          label="显示在前面"
          side="bottom"
          sideOffset={5}
          key={"back"}
        >
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <LuArrowUp className="size-4"></LuArrowUp>
          </Button>
        </TooltipComponents>
        <TooltipComponents
          label="显示在后面"
          side="bottom"
          sideOffset={5}
          key={Tool.StrokeWidth}
        >
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <LuArrowDown className="size-4"></LuArrowDown>
          </Button>
        </TooltipComponents>
      </div>
    </section>
  );
};

export default Tools;
