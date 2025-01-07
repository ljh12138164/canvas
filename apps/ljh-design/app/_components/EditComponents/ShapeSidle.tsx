import { cn } from '@/app/_lib/utils';
import { addObject, Tool } from '@/app/_types/Edit';

import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { Edit } from '@/app/_types/Edit';
import ShapeTool from './ShapeTool';
import ToolSiderbarClose from './ToolSiberbarClose';
import ToolSiderbar from './ToolSiderbar';

interface ShapeSidleProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const ShapeSidle = ({
  activeTool,
  onChangeActive,
  editor,
}: ShapeSidleProps) => {
  return (
    <aside
      className={cn(
        'z-[100] bg-white  relative transition  h-full flex flex-col ',
        activeTool === Tool.Shapes ? 'visible' : 'hidden'
      )}
      style={{ flexBasis: '300px' }}
    >
      <ToolSiderbar title='形状' description='选择形状工具' />
      <ScrollArea>
        <div className='grid grid-cols-3 gap-4 p-4'>
          {addObject.map((item) => (
            <ShapeTool
              key={item.key}
              Icon={item.icon}
              title={item.title}
              onClick={() => editor?.addObject(item)}
              iconClassName={
                item.otherOption?.angle
                  ? `rotate-${item.otherOption.angle}`
                  : ''
              }
            />
          ))}
        </div>
      </ScrollArea>
      <ToolSiderbarClose onClose={() => onChangeActive(Tool.Select)} />
    </aside>
  );
};

export default ShapeSidle;
