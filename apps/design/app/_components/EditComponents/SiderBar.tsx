import {
  LuLayout,
  LuImage,
  // LuPencil,
  // LuPresentation,
  LuSettings,
  LuShapes,
  LuSparkles,
  LuType,
} from "react-icons/lu";
import SiderBarItem from "./SiderBarItem";
import { Tool } from "@/types/Edit";
import { ScrollArea } from "@/components/ui/scroll-area";
interface SiderBarProps {
  acitiveTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
}
const SiderBar = ({ acitiveTool, onChangeActiveTool }: SiderBarProps) => {
  return (
    <aside
      id="editSider"
      className="w-[100px] z-[55]  bg-white  border-r border-t-black border-slate-200 overflow-y-auto"
      style={{ flexBasis: "100px" }}
    >
      <ScrollArea>
        <ul className="flex flex-col">
          <SiderBarItem
            icon={LuLayout}
            label="设计"
            isActive={acitiveTool === Tool.Layout}
            onClick={() => {
              onChangeActiveTool(Tool.Layout);
            }}
          />
          <SiderBarItem
            icon={LuImage}
            label="图片"
            isActive={acitiveTool === Tool.Image}
            onClick={() => {
              onChangeActiveTool(Tool.Image);
            }}
          />
          <SiderBarItem
            icon={LuType}
            label="文本"
            isActive={acitiveTool === Tool.Font}
            onClick={() => {
              onChangeActiveTool(Tool.Font);
            }}
          />
          <SiderBarItem
            icon={LuShapes}
            label="图形"
            isActive={acitiveTool === Tool.Shapes}
            onClick={() => {
              onChangeActiveTool(Tool.Shapes);
            }}
          />
          <SiderBarItem
            icon={LuSparkles}
            label="ai"
            isActive={acitiveTool === Tool.Sparkles}
            onClick={() => {
              onChangeActiveTool(Tool.Sparkles);
            }}
          />
          <SiderBarItem
            icon={LuSettings}
            label="设置"
            isActive={acitiveTool === Tool.Settings}
            onClick={() => {
              onChangeActiveTool(Tool.Settings);
            }}
          />
        </ul>
      </ScrollArea>
    </aside>
  );
};

export default SiderBar;
