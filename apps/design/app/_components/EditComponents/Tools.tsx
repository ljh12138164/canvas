import TooltipComponents from "@/components/shadui-Components/Tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Tool } from "@/types/Edit";
import { useState } from "react";
interface ToolBarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
}
const Tools = ({ editor, activeTool, onChangeActiveTool }: ToolBarProps) => {
  const selectedObject = editor?.canvas?.getActiveObject();
  //获取属性
  const getProperty = (property: any) => {
    if (!selectedObject) return null;
    return selectedObject.get(property);
  };
  const fillColor = getProperty("fill");
  const fillColor2 = editor?.fillColor;

  const [properties, setProperties] = useState({ fillColor });
  return (
    <section className="h-10 px-2 absolute left-[6.25rem] top-0 bg-white items-center flex w-full z-[50]">
      <div className="flex items-center h-full justify-center">
        <TooltipComponents label="颜色" side="bottom" sideOffset={5}>
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
      </div>
    </section>
  );
};

export default Tools;
