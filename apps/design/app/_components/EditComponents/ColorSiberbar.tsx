import { cn } from "@/lib/utils";
import type { Edit } from "@/types/Edit";
import { FILL_COLOR, Tool } from "@/types/Edit";

import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";
import ColorPicker from "./ColorPicker";

interface ColorSoiberbarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const ColorSoiberbar = ({
  activeTool,
  onChangeActive,
  editor,
}: ColorSoiberbarProps) => {
  const value = editor?.fillColor || FILL_COLOR;
  const onChangeColor = (color: string) => {
    editor?.setFillColor(color);
  };
  return (
    <aside
      className={cn(
        "z-[100] bg-white border-r relative transition w-[300px] h-full flex flex-col",
        activeTool === Tool.Fill ? "visible" : "hidden"
      )}
    >
      <ToolSiderbar title="颜色" description="更改填充颜色"></ToolSiderbar>
      <ScrollArea>
        <div className="p-4 space-y-4">
          <ColorPicker value={value} onChange={onChangeColor}></ColorPicker>
        </div>
      </ScrollArea>
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default ColorSoiberbar;
