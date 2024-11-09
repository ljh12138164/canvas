import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Filter } from "@/types/Edit";
import {
  canfilterArr,
  CANVAS_COLOR,
  Edit,
  FILL_COLOR,
  FilterItem,
  filters,
  fonts,
  STROKE_COLOR,
  Tool,
  ToolItem,
} from "@/types/Edit";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import FilterSetting from "./FilterSetting";
import ImageSetting from "./ImageSetting";
import StokeWidth from "./StokeWidth";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";

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
  //颜色
  const value = editor?.fillColor || FILL_COLOR;
  const stokevalue = editor?.strokeColor || STROKE_COLOR;
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [filterSetting, setFilterSetting] = useState<string>("");

  const initColor = editor?.getWorkspace()?.fill ?? "#ffffff";

  useEffect(() => {
    editor?.setCanvasColor(initColor as string);
  }, [editor, initColor, filterRef]);
  const onShow = () => {
    if (
      activeTool === Tool.Fill ||
      activeTool === Tool.StrokeColor ||
      activeTool === Tool.StrokeWidth ||
      activeTool === Tool.Opacity ||
      activeTool === Tool.FontFamily ||
      activeTool === Tool.Filter ||
      activeTool === Tool.Draw ||
      activeTool === Tool.Settings ||
      activeTool === Tool.FilterSetting
    )
      return activeTool;
    return "";
  };
  useEffect(() => {
    filterRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [filterRef]);
  //检查滤镜是否选中
  const check = (item: string) => {
    if (item === "none" && editor?.getActiveFilter().length === 0) return true;
    return editor?.getActiveFilter().includes(item) || false;
  };
  return (
    <aside
      className={cn(
        "z-[600] bg-white border-r-2 pb-12 border-black/10 relative transition w-[300px] h-full flex flex-col",
        onShow() ? "visible" : "hidden"
      )}
    >
      <ToolSiderbar
        onChangeActive={onChangeActive}
        front={onShow() === Tool.FilterSetting}
        title={ToolItem[onShow() as keyof typeof ToolItem] || ""}
        description={`更改${ToolItem[onShow() as keyof typeof ToolItem] || ""}`}
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
          {/* 滤镜 */}
          {onShow() === Tool.Filter && (
            <section className="flex flex-col gap-2 pb-12">
              {filters.map((item: Filter) => {
                return (
                  <Button
                    key={item}
                    variant="outline"
                    onClick={() => {
                      if (item === "none") {
                        editor?.cleanFilter();
                      } else if (
                        check(item) &&
                        editor?.getActiveFilter().length === 1
                      ) {
                        editor?.cleanFilter();
                      } else if (check(item)) {
                        editor?.deleteImageFilter(item);
                      } else {
                        editor?.changeImageFilter(item);
                      }
                    }}
                    className={`w-full h-16 relative  justify-start text-left ${check(item) && "border-blue-500 border-2"}`}
                  >
                    {FilterItem[item]}
                    {check(item) && (
                      <div className=" absolute top-0 right-0 bg-indigo-600 text-white text-xs px-2 duration-300">
                        {editor &&
                          item !== "none" &&
                          editor?.getActiveFilterIndex(item) + 1}
                      </div>
                    )}
                    {canfilterArr.includes(item) && (
                      <ImageSetting
                        filter={item}
                        setFilterSetting={setFilterSetting}
                        activeTool={activeTool}
                        onChangeActive={onChangeActive}
                        isShow={check(item) && item !== "none"}
                      ></ImageSetting>
                    )}
                  </Button>
                );
              })}
            </section>
          )}
          {/* 滤镜设置 */}
          {onShow() === Tool.FilterSetting && (
            <FilterSetting
              editor={editor}
              filterSetting={filterSetting}
            ></FilterSetting>
          )}
          {onShow() === Tool.Draw && (
            <section>
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
                    editor?.setDrewWidths(value[0]);
                  }}
                ></Slider>
              </div>
              <Separator></Separator>
              <ColorPicker
                value={editor?.drewColor || STROKE_COLOR}
                onChange={(color) => {
                  editor?.setDrewColors(color);
                }}
                noshow={true}
                key={Tool.Draw}
              ></ColorPicker>
            </section>
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
                  value={editor?.canvasWidth}
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
                  noshow={true}
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
