import { cn } from "@/lib/utils";
import type { Edit } from "@/types/Edit";
import { FILL_COLOR, STROKE_COLOR, Tool } from "@/types/Edit";

import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";
import ColorPicker from "./ColorPicker";
import { useMemoizedFn } from "ahooks";

interface ColorSoiberbarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const obj = {
  [Tool.Fill]: "填充颜色",
  [Tool.StrokeColor]: "描边颜色",
  "": "",
};
const ColorSoiberbar = ({
  activeTool,
  onChangeActive,
  editor,
}: ColorSoiberbarProps) => {
  //颜色
  const value = editor?.fillColor || FILL_COLOR;
  const stokevalue = editor?.strokeColor || STROKE_COLOR;

  const onShow = useMemoizedFn(() => {
    if (activeTool === Tool.Fill || activeTool === Tool.StrokeColor)
      return activeTool;
    return "";
  });
  return (
    <aside
      className={cn(
        "z-[100] bg-white border-r relative transition w-[300px] h-full flex flex-col",
        onShow() ? "visible" : "hidden"
      )}
    >
      <ToolSiderbar
        title="颜色"
        description={`更改${obj[onShow()] || ""}`}
      ></ToolSiderbar>
      <ScrollArea>
        <div className="p-4 space-y-4">
          {onShow() === Tool.Fill || (
            <ColorPicker
              value={value}
              key={Tool.Fill}
              onChange={(color) => editor?.setStrokeColor(color)}
            ></ColorPicker>
          )}
          {onShow() === Tool.StrokeColor || (
            <ColorPicker
              value={stokevalue}
              onChange={(color) => {
                editor?.setFillColor(color);
              }}
              key={Tool.StrokeColor}
            ></ColorPicker>
          )}
        </div>
      </ScrollArea>
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default ColorSoiberbar;
