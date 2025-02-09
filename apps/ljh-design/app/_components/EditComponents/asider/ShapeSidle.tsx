import { Button } from '@/app/_components/ui/button';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { cn } from '@/app/_lib/utils';
import { Tool, addObject } from '@/app/_types/Edit';
import type { Edit } from '@/app/_types/Edit';
import { useState } from 'react';
import MyMaterialList from './MyMaterialList';
import ShapeTool from './ShapeTool';
import ToolSiderbarClose from './ToolSiberbarClose';
import ToolSiderbar from './ToolSiderbar';
interface ShapeSidleProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
  userId?: string;
}
const ShapeSidle = ({ activeTool, onChangeActive, editor, userId }: ShapeSidleProps) => {
  const [upload, setUpload] = useState<'default' | 'my'>('default');
  return (
    <aside
      className={cn(
        'z-[50] bg-white dark:bg-background  relative transition  h-full flex flex-col ',
        activeTool === Tool.Shapes ? 'visible' : 'hidden',
      )}
      style={{ flexBasis: '300px' }}
    >
      <ToolSiderbar title="素材" description="选择素材添加到画布" />
      <ScrollArea>
        {userId && (
          <nav className="flex gap-2 px-4 my-4">
            <Button
              variant={upload !== 'default' ? 'outline' : undefined}
              className="w-full"
              onClick={() => setUpload('default')}
            >
              默认素材
            </Button>
            <Button
              variant={upload !== 'my' ? 'outline' : undefined}
              className="w-full"
              onClick={() => setUpload('my')}
            >
              我的素材
            </Button>
          </nav>
        )}
        <div className="grid grid-cols-3 gap-4 px-4">
          {upload === 'default' &&
            addObject.map((item) => (
              <ShapeTool
                key={item.key}
                Icon={item.icon}
                title={item.title}
                onClick={() => editor?.addObject(item)}
                iconClassName={item.otherOption?.angle ? 'rotate-180' : ''}
              />
            ))}
        </div>
        <div className="grid grid-cols-2 gap-4 px-4">
          {upload === 'my' && userId && <MyMaterialList editor={editor} userId={userId} />}
        </div>
      </ScrollArea>
      <ToolSiderbarClose onClose={() => onChangeActive(Tool.Select)} />
    </aside>
  );
};

export default ShapeSidle;
