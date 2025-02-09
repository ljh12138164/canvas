import { Button } from '@/app/_components/ui/button';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { cn } from '@/app/_lib/utils';
import { type Edit, Font, Tool } from '@/app/_types/Edit';
import ToolSiderbarClose from './ToolSiberbarClose';
import ToolSiderbar from './ToolSiderbar';

interface TextSidebarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const TextSidebar = ({ activeTool, onChangeActive, editor }: TextSidebarProps) => {
  return (
    <aside
      className={cn(
        'z-[100] bg-white dark:bg-background  relative transition  h-full flex flex-col',
        activeTool === Tool.Font ? 'visible' : 'hidden',
      )}
      style={{ flexBasis: '300px' }}
    >
      <ToolSiderbar title="字体" description="插入字体" />
      <ScrollArea>
        <section className=" p-4 border-b space-y-4">
          {Font.map((item) => (
            <Button
              key={item.name}
              className="w-full py-6"
              style={{
                height: `${+item.fontSize.slice(0, 2) + 30}px`,
                fontSize: item.fontSize,
                fontWeight: item.fontWeight,
                fontFamily: item.fontFamily,
              }}
              type="button"
              variant="outline"
              onClick={() => {
                editor?.addText(item.name, {
                  fontSize: +item.fontSize.slice(0, 2),
                  fontWeight: item.fontWeight,
                  fontFamily: item.fontFamily,
                });
              }}
            >
              {item.title}
            </Button>
          ))}
        </section>
      </ScrollArea>
      <ToolSiderbarClose onClose={() => onChangeActive(Tool.Select)} />
    </aside>
  );
};

export default TextSidebar;
