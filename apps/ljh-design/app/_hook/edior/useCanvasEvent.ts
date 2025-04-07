import { useSave } from '@/app/_store/save';
import { Tool } from '@/app/_types/Edit';
import type * as fabric from 'fabric';
import { useEffect } from 'react';
import type { Sessions } from '../../_types/user';
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  tool: Tool;
  setSelectedObject: (object: fabric.FabricObject[]) => void;
  setTool: (tool: Tool) => void;
  save: (skip?: boolean, des?: string) => void;
  isLoading: boolean;
  user: Sessions | undefined;
}

/***
 * ### canvas事件，创建图形（create），变更选择图形（updated），取消选择图形（cleared）
 * @param {fabric.Canvas} canvas
 */
const useCanvasEvent = ({
  canvas,
  tool,
  save,
  setSelectedObject,
  setTool,
  isLoading,
  user,
}: CanvasEventProps) => {
  const { setCloudSave } = useSave();
  useEffect(() => {
    if (canvas) {
      // 不能用添加对象，因为初始化添加对象时，
      canvas.on('object:added', (event) => {
        if (event.target.name === 'board') return;
        if (isLoading) return;
        save();
        setCloudSave(false);
      });
      canvas.on('object:removed', () => {
        if (isLoading) return;
        save();
        setCloudSave(false);
      });
      canvas.on('object:modified', () => {
        if (isLoading) return;
        save();
        setCloudSave(false);
      });
      // 选择
      canvas.on('selection:created', (e) => {
        if (isLoading) return;
        setSelectedObject(e.selected || []);
      });

      // 更新选择
      canvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected || []);
      });

      // 清除选择
      canvas.on('selection:cleared', () => {
        if (
          tool === Tool.Font ||
          tool === Tool.Fill ||
          tool === Tool.Filter ||
          tool === Tool.FilterSetting ||
          tool === Tool.StrokeColor ||
          tool === Tool.StrokeWidth ||
          tool === Tool.RemoveBg ||
          tool === Tool.Opacity
        )
          setTool(Tool.Select);
        setSelectedObject([]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, isLoading]);
};

export default useCanvasEvent;
