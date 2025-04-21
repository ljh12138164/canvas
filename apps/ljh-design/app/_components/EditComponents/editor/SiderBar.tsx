import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { type Edit, type EditType, Tool } from '@/app/_types/Edit';
import { Grape } from 'lucide-react';
import { useRef } from 'react';
import {
  LuImage,
  LuLayoutDashboard,
  LuMessageSquare,
  LuPencil,
  LuSettings,
  LuShapes,
  LuSmile,
  LuType,
} from 'react-icons/lu';
import Grap from '../asider/GrapSider';
import SiderBarItem from '../asider/SiderBarItem';
interface SiderBarProps {
  acitiveTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
  type: EditType;
  login?: boolean;
  editor: Edit | undefined;
}
const SiderBar = ({
  acitiveTool,
  onChangeActiveTool,
  type,
  login = true,
  editor,
}: SiderBarProps) => {
  return (
    <aside
      id="editSider"
      className="w-[100px] z-40  border-r bg-[#fff] dark:bg-background overflow-y-auto"
      style={{ flexBasis: '100px' }}
    >
      <ScrollArea className="h-[90dvh]" style={{ scrollbarWidth: 'none' }}>
        <ul className="flex flex-col w-[6.2rem]">
          {/* 设计 */}
          {type !== 'material' && (
            <SiderBarItem
              icon={LuLayoutDashboard}
              label="模板"
              isActive={acitiveTool === Tool.Template}
              onClick={() => {
                onChangeActiveTool(Tool.Template);
              }}
            />
          )}
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
            label="素材"
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
          {login && (
            <SiderBarItem
              icon={LuMessageSquare}
              label="AI"
              isActive={acitiveTool === Tool.Ai}
              onClick={() => {
                onChangeActiveTool(Tool.Ai);
              }}
            />
          )}
          {/* 图表 */}
          <SiderBarItem
            icon={Grape}
            label="流程图"
            isActive={acitiveTool === Tool.Grap}
            onClick={() => {
              onChangeActiveTool(Tool.Grap);
            }}
          />
          {/* 表情 */}
          <SiderBarItem
            icon={LuSmile}
            label="表情"
            isActive={acitiveTool === Tool.Emoji}
            onClick={() => {
              onChangeActiveTool(Tool.Emoji);
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
      <Grap editor={editor} acitiveTool={acitiveTool} onChangeActiveTool={onChangeActiveTool} />
    </aside>
  );
};

export default SiderBar;
