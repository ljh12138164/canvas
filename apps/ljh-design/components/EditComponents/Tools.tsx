import TooltipComponents from '@/components/shadui-Components/Tooltip';
import { Button } from '@/components/ui/button';
import { cn, isText } from '@/lib/utils';
import { Tool, Edit } from '@/types/Edit';
import { BsBorderWidth, BsTransparency } from 'react-icons/bs';
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaTrash,
  FaUnderline,
} from 'react-icons/fa6';
import { LuArrowDown, LuArrowUp, LuChevronDown, LuCopy } from 'react-icons/lu';
import { TbColorFilter } from 'react-icons/tb';
import FontSizeInput from './FontSizeInput';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
interface ToolBarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
}

const Tools = ({ editor, activeTool, onChangeActiveTool }: ToolBarProps) => {
  const selectedObject = editor?.canvas?.getActiveObject();
  //获取属性
  const getProperty = (property: string) => {
    if (!selectedObject) return null;
    return selectedObject.get(property);
  };
  //获取颜色和
  const fillColor = getProperty('fill');
  const storkeColor = editor?.getActiveStokeColor();
  //字体
  if (!editor?.selectedObject?.length) {
    return (
      <section className='h-[3.3rem]  p-[0.1rem] space-x-4 bg-white items-center flex w-full z-[50]' />
    );
  }
  const seltectedObject = editor?.canvas?.getActiveObjects()[0];
  const textYype = isText(seltectedObject);
  const isImage = selectedObject?.type === 'image';
  return (
    <ScrollArea className='h-[3.3rem]  p-[0.1rem]  space-x-4 bg-white items-center flex w-full z-[50]'>
      <div className='flex items-center h-full  gap-2 w-full  overflow-y-hidden'>
        <section className='flex items-center gap-2'>
          {!isImage && (
            <TooltipComponents
              label='颜色'
              side='bottom'
              sideOffset={5}
              key={Tool.Fill}
            >
              <Button
                onClick={() => onChangeActiveTool(Tool.Fill)}
                size='icon'
                variant='ghost'
                className={cn(activeTool === Tool.Fill && 'bg-gray-100')}
              >
                <div
                  className={`rounded-small size-4 border `}
                  style={{ backgroundColor: fillColor ? fillColor : 'black' }}
                />
              </Button>
            </TooltipComponents>
          )}
          {!textYype && (
            <TooltipComponents
              label='边框颜色'
              side='bottom'
              sideOffset={5}
              key={Tool.StrokeColor}
            >
              <Button
                onClick={() => onChangeActiveTool(Tool.StrokeColor)}
                size='icon'
                variant='ghost'
                className={cn(activeTool === Tool.StrokeColor && 'bg-gray-100')}
              >
                <div
                  className={`rounded-small size-4 border bg-white `}
                  style={{
                    border: storkeColor
                      ? `2px solid ${storkeColor}`
                      : '2px solid black',
                  }}
                />
              </Button>
            </TooltipComponents>
          )}
          {!textYype && (
            <TooltipComponents
              label='边框宽度'
              side='bottom'
              sideOffset={5}
              key={Tool.StrokeWidth}
            >
              <Button
                onClick={() => onChangeActiveTool(Tool.StrokeWidth)}
                size='icon'
                variant='ghost'
                className={cn(activeTool === Tool.StrokeWidth && 'bg-gray-100')}
              >
                <BsBorderWidth className='size-4'></BsBorderWidth>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <TooltipComponents
              label='字体'
              side='bottom'
              sideOffset={5}
              key={Tool.FontFamily}
            >
              <Button
                onClick={() => {
                  onChangeActiveTool(Tool.FontFamily);
                }}
                size='icon'
                variant='ghost'
                className={cn(
                  'w-auto',
                  activeTool === Tool.FontFamily && 'bg-gray-100'
                )}
              >
                <div className='max-w-[100px] truncate px-2'>
                  {editor?.getActiveFontFamily()}
                </div>
                <LuChevronDown className='size-4'></LuChevronDown>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <TooltipComponents
              label='删除线'
              side='bottom'
              sideOffset={5}
              key={Tool.FontThought}
            >
              <Button
                onClick={() => {
                  const value = !editor.getActiveFontLineThrough();
                  editor?.changeFontLineThrough(value);
                }}
                size='icon'
                variant='ghost'
                className={cn(
                  'w-auto',
                  editor?.getActiveFontLineThrough() && 'bg-gray-100'
                )}
              >
                <div className='px-2'>
                  <FaStrikethrough className='size-4'></FaStrikethrough>
                </div>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <TooltipComponents
              label='下划线'
              side='bottom'
              sideOffset={5}
              key={Tool.FontUnderline}
            >
              <Button
                onClick={() => {
                  const value = !editor?.getActiveFontUnderline();
                  editor?.changeFontUnderline(value);
                }}
                size='icon'
                variant='ghost'
                className={cn(
                  'w-auto',
                  editor?.getActiveFontUnderline() && 'bg-gray-100'
                )}
              >
                <div className='px-2'>
                  <FaUnderline className='size-4'></FaUnderline>
                </div>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <TooltipComponents
              label='斜体'
              side='bottom'
              sideOffset={5}
              key={Tool.FontItalic}
            >
              <Button
                onClick={() => {
                  const value =
                    editor?.getActiveFontItalic() === 'normal'
                      ? 'italic'
                      : 'normal';
                  editor?.changeFontItalic(value);
                }}
                size='icon'
                variant='ghost'
                className={cn(
                  'w-auto',
                  editor?.getActiveFontItalic() === 'italic' && 'bg-gray-100'
                )}
              >
                <div className='px-2'>
                  <FaItalic className='size-4'></FaItalic>
                </div>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <TooltipComponents
              label='加粗'
              side='bottom'
              sideOffset={5}
              key={'blod'}
            >
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  const activefontWeight = editor?.getActiveStrokeWeight();
                  if (activefontWeight === 'normal')
                    editor?.changeFontWeight('bold');
                  if (activefontWeight === 'bold') {
                    editor?.changeFontWeight('normal');
                  }
                }}
                className={`${editor?.getActiveStrokeWeight() === 'bold' && 'bg-gray-100'}`}
              >
                <FaBold className='size-4'></FaBold>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <TooltipComponents
              label='水平向左'
              side='bottom'
              sideOffset={5}
              key={'textAlignLeft'}
            >
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  editor?.changeFontAlign('left');
                }}
                className={`${editor?.getActiveFontAlign() === 'left' && 'bg-gray-100'}`}
              >
                <FaAlignLeft className='size-4'></FaAlignLeft>
              </Button>
            </TooltipComponents>
          )}

          {textYype && (
            <TooltipComponents
              label='水平居中'
              side='bottom'
              sideOffset={5}
              key={'textAlignCenter'}
            >
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  editor?.changeFontAlign('center');
                }}
                className={`${editor?.getActiveFontAlign() === 'center' && 'bg-gray-100'}`}
              >
                <FaAlignCenter className='size-4'></FaAlignCenter>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <TooltipComponents
              label='水平向右'
              side='bottom'
              sideOffset={5}
              key={'textAlignRight'}
            >
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  editor?.changeFontAlign('right');
                }}
                className={`${editor?.getActiveFontAlign() === 'right' && 'bg-gray-100'}`}
              >
                <FaAlignRight className='size-4'></FaAlignRight>
              </Button>
            </TooltipComponents>
          )}
          {textYype && (
            <div className='flex item-center  h-full justify-center'>
              <FontSizeInput editor={editor}></FontSizeInput>
            </div>
          )}
          {isImage && (
            <TooltipComponents
              label='过滤器'
              side='bottom'
              sideOffset={5}
              key={Tool.Filter}
            >
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  onChangeActiveTool(Tool.Filter);
                }}
                className={`${activeTool === Tool.Filter && 'bg-gray-100'}`}
              >
                <TbColorFilter className='size-4'></TbColorFilter>
              </Button>
            </TooltipComponents>
          )}
        </section>
        <section className='flex items-center gap-2 ml-auto'>
          <TooltipComponents
            label='显示在前面'
            side='bottom'
            sideOffset={5}
            key={'back'}
          >
            <Button
              onClick={() => editor?.bringForward()}
              size='icon'
              variant='ghost'
            >
              <LuArrowUp className='size-4'></LuArrowUp>
            </Button>
          </TooltipComponents>
          <TooltipComponents
            label='显示在后面'
            side='bottom'
            sideOffset={5}
            key={'end'}
          >
            <Button
              onClick={() => editor?.sendBackwards()}
              size='icon'
              variant='ghost'
            >
              <LuArrowDown className='size-4'></LuArrowDown>
            </Button>
          </TooltipComponents>
          <TooltipComponents
            label='透明度'
            side='bottom'
            sideOffset={5}
            key={Tool.Opacity}
          >
            <Button
              onClick={() => onChangeActiveTool(Tool.Opacity)}
              size='icon'
              variant='ghost'
              className={cn(activeTool === Tool.Opacity && 'bg-gray-100')}
            >
              <BsTransparency className='size-4'></BsTransparency>
            </Button>
          </TooltipComponents>
          <TooltipComponents
            label='复制'
            side='bottom'
            sideOffset={5}
            key={Tool.Copy}
          >
            <Button
              onClick={() => {
                editor?.copy();
                editor?.pasty();
              }}
              size='icon'
              variant='ghost'
            >
              <LuCopy className='size-4'></LuCopy>
            </Button>
          </TooltipComponents>
          <TooltipComponents
            label='删除'
            side='bottom'
            sideOffset={5}
            key={Tool.Delete}
          >
            <Button onClick={() => editor.delete()} size='icon' variant='ghost'>
              <FaTrash className='size-4'></FaTrash>
            </Button>
          </TooltipComponents>
        </section>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};

export default Tools;
