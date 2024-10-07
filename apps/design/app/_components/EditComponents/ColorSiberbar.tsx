import { cn } from "@/lib/utils";
import type { Edit } from "@/types/Edit";
import { FILL_COLOR, fonts, STROKE_COLOR, Tool } from "@/types/Edit";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useMemoizedFn } from "ahooks";
import ColorPicker from "./ColorPicker";
import StokeWidth from "./StokeWidth";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";

interface ColorSoiberbarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const obj = {
  [Tool.Fill]: "填充颜色",
  [Tool.StrokeColor]: "描边颜色",
  [Tool.StrokeWidth]: "边框宽度",
  [Tool.Opacity]: "透明度",
  [Tool.FontFamily]: "字体类型",
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
    if (
      activeTool === Tool.Fill ||
      activeTool === Tool.StrokeColor ||
      activeTool === Tool.StrokeWidth ||
      activeTool === Tool.Opacity ||
      activeTool === Tool.FontFamily
    )
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
        title={obj[onShow()] || ""}
        description={`更改${obj[onShow()] || ""}`}
      ></ToolSiderbar>
      <ScrollArea>
        <div className="p-4 space-y-4">
          {onShow() === Tool.Fill && (
            <ColorPicker
              value={value}
              key={Tool.Fill}
              onChange={(color) => {
                editor?.setFillColor(color);
              }}
            ></ColorPicker>
          )}
          {onShow() === Tool.StrokeColor && (
            <ColorPicker
              value={stokevalue}
              onChange={(color) => {
                editor?.setStrokeColor(color);
              }}
              key={Tool.StrokeColor}
            ></ColorPicker>
          )}
          {onShow() === Tool.StrokeWidth && (
            <StokeWidth key={Tool.StrokeWidth} editor={editor}></StokeWidth>
          )}
          {onShow() === Tool.Opacity && (
            <Slider
              max={1}
              min={0}
              key={Tool.Opacity}
              value={[editor?.getOpacty() || 0]}
              step={0.01}
              onValueChange={(value) => {
                editor?.changeOpacty(value[0]);
              }}
            />
          )}
          {onShow() === Tool.FontFamily && (
            <section className="space-y-2 pb-[5rem]">
              {fonts.map((item: string) => {
                return (
                  <Button
                    key={item}
                    variant="ghost"
                    style={{
                      fontFamily: item,
                      fontSize: "16px",
                      padding: "8px 16px",
                    }}
                    onClick={() => {
                      editor?.setFontFamily(item);
                    }}
                    className={`w-full h-16 justify-start text-left ${editor?.fontFamily === item && "border-blue-500 border-2"}`}
                  >
                    {item}
                  </Button>
                );
              })}
            </section>
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
