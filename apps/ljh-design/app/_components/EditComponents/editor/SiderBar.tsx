import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { Tool } from '@/app/_types/Edit';
import {
  LuImage,
  LuLayoutDashboard,
  LuMessageSquare,
  LuPencil,
  LuSettings,
  LuShapes,
  LuType,
} from 'react-icons/lu';
import SiderBarItem from '../asider/SiderBarItem';
interface SiderBarProps {
  acitiveTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
}
const SiderBar = ({ acitiveTool, onChangeActiveTool }: SiderBarProps) => {
  return (
    <aside
      id="editSider"
      className="w-[100px] z-[40]  border-r bg-[#fff] dark:bg-background overflow-y-auto"
      style={{ flexBasis: '100px' }}
    >
      <ScrollArea>
        <ul className="flex flex-col w-[6.2rem]">
          {/* 设计 */}
          <SiderBarItem
            icon={LuLayoutDashboard}
            label="设计"
            isActive={acitiveTool === Tool.Layout}
            onClick={() => {
              onChangeActiveTool(Tool.Layout);
            }}
          />
          {/* 图片 */}
          <SiderBarItem
            icon={LuImage}
            label="图片"
            isActive={acitiveTool === Tool.Image}
            onClick={() => {
              onChangeActiveTool(Tool.Image);
            }}
          />
          {/* 文本 */}
          <SiderBarItem
            icon={LuType}
            label="文本"
            isActive={acitiveTool === Tool.Font}
            onClick={() => {
              onChangeActiveTool(Tool.Font);
            }}
          />
          {/* 图形 */}
          <SiderBarItem
            icon={LuShapes}
            label="图形"
            isActive={acitiveTool === Tool.Shapes}
            onClick={() => {
              onChangeActiveTool(Tool.Shapes);
            }}
          />
          {/* 绘画 */}
          <SiderBarItem
            icon={LuPencil}
            label="绘画"
            isActive={acitiveTool === Tool.Draw}
            onClick={() => {
              onChangeActiveTool(Tool.Draw);
            }}
          />
          {/* ai */}
          <SiderBarItem
            icon={LuMessageSquare}
            label="AI"
            isActive={acitiveTool === Tool.Ai}
            onClick={() => {
              onChangeActiveTool(Tool.Ai);
            }}
          />
          {/* 设置 */}
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
