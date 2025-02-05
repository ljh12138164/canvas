'use client';
import { cn } from '@/app/_lib/utils';
import { type Edit, Tool } from '@/app/_types/Edit';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import DefaultTemplateList from '../../template/DefaultTemplateList';
import UserTemplateList from '../../template/UserTemplateList';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import ToolSiderbarClose from './ToolSiberbarClose';
interface TemplateSiderbarProps {
  editor: Edit | undefined;
  onChangeActive: (tool: Tool) => void;
  activeTool: Tool;
}
type TemplateBtn = 'default' | 'myTemplate';
export const TemplateSiderbar = ({ editor, onChangeActive, activeTool }: TemplateSiderbarProps) => {
  const onShow = useMemoizedFn(() => activeTool === Tool.Template);
  const onClose = useMemoizedFn(() => onChangeActive(Tool.Select));
  const [template, setTemplate] = useState<TemplateBtn>(
    (localStorage.getItem('Template') as TemplateBtn | undefined) ?? 'default',
  );
  return (
    <aside
      className={cn(
        'z-[40] bg-white dark:bg-background  border-black/10 relative transition w-[300px] h-full flex flex-col',
        onShow() ? 'visible' : 'hidden',
      )}
    >
      <ToolSiderbarClose onClose={onClose} />
      <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(100dvh-80px)]">
        <div className="p-4">
          <h2 className="text-lg font-medium">模板</h2>
        </div>
        <nav className="flex w-full px-2 gap-2">
          <Button
            variant={template !== 'default' ? 'outline' : undefined}
            className="w-full"
            onClick={() => setTemplate('default')}
          >
            默认模板
          </Button>
          <Button
            variant={template !== 'myTemplate' ? 'outline' : undefined}
            className="w-full"
            onClick={() => setTemplate('myTemplate')}
          >
            我的模板
          </Button>
        </nav>
        <section className="flex flex-col gap-y-2 p-4">
          {template === 'default' && <DefaultTemplateList editor={editor} />}
          {template === 'myTemplate' && <UserTemplateList editor={editor} />}
        </section>
      </ScrollArea>
    </aside>
  );
};
