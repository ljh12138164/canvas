import { type DefalutUser, Tool, type UserState } from '@/app/_types/Edit';
import type * as fabric from 'fabric';
import { type RefObject, useEffect } from 'react';
import type { WebsocketProvider } from 'y-websocket';
import type * as Y from 'yjs';
import type { Sessions } from '../../_types/user';
interface CanvasEventProps {
  canvas: fabric.Canvas | null;
  tool: Tool;
  setSelectedObject: (object: fabric.Object[]) => void;
  setTool: (tool: Tool) => void;
  save: (skip?: boolean, des?: string) => void;
  userState: [number, UserState][];
  user: Sessions | null;
  websockets: WebsocketProvider | null;
  userData?: RefObject<DefalutUser>;
  yMaps?: Y.Map<string>;
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
  websockets,
  user,
  userState,
  yMaps,
  userData,
}: CanvasEventProps) => {
  useEffect(() => {
    if (canvas) {
      // 不能用添加对象，因为初始化添加对象时，
      canvas.on('object:added', (event) => {
        // 画布
        if (event.target.name === 'board') return;
        // 添加到ymap
        // yMaps?.set(
        //   event.target?.id,
        //   JSON.stringify({ ...event.target, changeType: 'add', changeClientId: user.user.id }),
        // );
        // save();
      });
      canvas.on('object:removed', (element) => {
        if (!user) return;
        // 画布
        if (element.target.name === 'board') return;
        // yMaps?.set(element.target.id, JSON.stringify({ ...element.target, changeType: 'delete' }));
        // 从ymap中删除
        // yMaps?.delete(item.target.id);
        // websocket?.emit("remove", [item]);
        // console.log(item);
        // yMap.set("json", canvas.toJSON());
        // save();
      });
      canvas.on('object:modified', () => {
        if (!user) return;
        // websocket?.emit("update", [item]);
        // 更新ymap
        // yMaps?.set(item.target.id, item.target);
        // console.log(item);
        // yMap.set("json", canvas.toJSON());
        // save();
      });
      // 选择
      canvas.on('selection:created', (e) => {
        if (!user) return;
        websockets?.awareness.setLocalStateField('select', {
          ...userData?.current,
          select: canvas.getActiveObjects().map((item) => item.id),
        });
        setSelectedObject(e.selected || []);
      });

      // 更新选择
      canvas.on('selection:updated', (e) => {
        if (!user) return;
        websockets?.awareness.setLocalStateField('select', {
          ...userData?.current,
          select: canvas.getActiveObjects().map((item) => item.id),
        });
        setSelectedObject(e.selected || []);
      });

      // 清除选择
      canvas.on('selection:cleared', () => {
        if (!user) return;
        websockets?.awareness.setLocalStateField('select', {
          ...userData?.current,
          select: canvas.getActiveObjects().map((item) => item.id),
        });

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
  }, [canvas]);
  useEffect(() => {
    // console.log(userState);
    // console.log(websockets?.awareness.getStates());
  }, [userState]);
};

export default useCanvasEvent;
