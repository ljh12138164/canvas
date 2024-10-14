import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Edit, Filter } from "@/types/Edit";
import {
  CANVAS_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FILL_COLOR,
  filters,
  fonts,
  STROKE_COLOR,
  Tool,
} from "@/types/Edit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemoizedFn } from "ahooks";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
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
  [Tool.Filter]: "滤镜",
  [Tool.Draw]: "画笔",
  [Tool.Settings]: "设置",
  "": "",
};

const filterItem = {
  none: "无",
  polaroid: "偏振",
  sepia: "棕褐色",
  kodachrome: "彩色胶片",
  contrast: "对比度",
  brightness: "亮度",
  brownie: "棕褐色",
  vintage: "复古",
  grayscale: "灰度",
  invert: "反色",
  technicolor: "科技",
  pixelate: "像素化",
  blur: "模糊",
  sharpen: "锐化",
  emboss: "滤波",
  removecolor: "去色",
  blackwhite: "黑白",
  vibrance: "饱和度",
  blendcolor: "混合颜色",
  huerotation: "色调旋转",
  resize: "调整大小",
  saturation: "饱和度",
  gamma: "伽马",
};
const ColorSoiberbar = ({
  activeTool,
  onChangeActive,
  editor,
}: ColorSoiberbarProps) => {
  //颜色
  const value = editor?.fillColor || FILL_COLOR;
  const stokevalue = editor?.strokeColor || STROKE_COLOR;

  const initColor = useMemo(() => {
    return editor?.getWorkspace()?.fill ?? "#ffffff";
  }, [editor]);
  useEffect(() => {
    editor?.setCanvasColor(initColor as string);
  }, [editor, initColor]);

  const onShow = useMemoizedFn(() => {
    if (
      activeTool === Tool.Fill ||
      activeTool === Tool.StrokeColor ||
      activeTool === Tool.StrokeWidth ||
      activeTool === Tool.Opacity ||
      activeTool === Tool.FontFamily ||
      activeTool === Tool.Filter ||
      activeTool === Tool.Draw ||
      activeTool === Tool.Settings
    )
      return activeTool;
    return "";
  });
  const check = useMemoizedFn((item: string) => {
    return (editor?.getActiveFilter() || "none").toLowerCase() === item;
  });
  return (
    <aside
      className={cn(
        "z-[600] bg-white border-r-2 pb-24 border-black/10 relative transition w-[300px] h-full flex flex-col",
        onShow() ? "visible" : "hidden"
      )}
    >
      <ToolSiderbar
        title={obj[onShow()] || ""}
        description={`更改${obj[onShow()] || ""}`}
      ></ToolSiderbar>
      <ScrollArea className="z-[601] h-full">
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
          {onShow() === Tool.Filter && (
            <section className="flex flex-col gap-2 pb-12">
              {filters.map((item: Filter) => {
                return (
                  <Button
                    key={item}
                    variant="outline"
                    onClick={() => {
                      editor?.changeImageFilter(item);
                    }}
                    className={`w-full h-16  justify-start text-left ${check(item) && " border-blue-500 border-2"}`}
                  >
                    {filterItem[item]}
                  </Button>
                );
              })}
            </section>
          )}
          {onShow() === Tool.Draw && (
            <>
              <div className=" pb-6  pt-2 w-full flex mb-2   justify-center gap-4 flex-col">
                <p>
                  画笔粗细<span>({editor?.drawWidth || 1}px)</span>
                </p>
                <Slider
                  step={0.5}
                  key={Tool.Draw}
                  min={1}
                  max={20}
                  value={[editor?.drawWidth || 1]}
                  onValueChange={(value) => {
                    editor?.setDrewWidth(value[0]);
                  }}
                ></Slider>
              </div>
              <Separator></Separator>
              <ColorPicker
                value={editor?.drewColor || STROKE_COLOR}
                onChange={(color) => {
                  editor?.setDrewColor(color);
                }}
                key={Tool.Draw}
              ></ColorPicker>
            </>
          )}
          {onShow() === Tool.Settings && (
            <form className="flex flex-col gap-2">
              <div className="space-y-2">
                <Label htmlFor="hight">高度</Label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  type="number"
                  name="hight"
                  value={editor?.canvasHeight}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    editor?.changeSize({
                      width: editor.canvasWidth,
                      height: +e.target.value,
                    });
                  }}
                  placeholder="高度"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">宽度</Label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  type="number"
                  value={editor.canvasWidth}
                  name="width"
                  placeholder="请输入宽度"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    await editor?.changeSize({
                      width: +e.target.value,
                      height: editor.canvasHeight,
                    });
                  }}
                />
              </div>
              <Button
                onClick={async () => {
                  await editor?.changeSize({ width: 800, height: 1100 });
                }}
                type="button"
                className="w-full"
              >
                重置
              </Button>
              <div className="p-4">
                <ColorPicker
                  value={editor?.canvasColor || CANVAS_COLOR}
                  onChange={(color) => {
                    editor?.changeBackground(color);
                  }}
                ></ColorPicker>
              </div>
            </form>
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
