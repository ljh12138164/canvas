import { useMemoizedFn } from "ahooks";
import * as fabric from "fabric";
import { useRef } from "react";
import toast from "react-hot-toast";
interface UserClipboard {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UserClipboard) => {
  const clipboard = useRef<fabric.FabricObject | undefined | null>(null);
  const copy = useMemoizedFn(async () => {
    clipboard.current = await canvas?.getActiveObject()?.clone();
  });
  const paste = useMemoizedFn(async () => {
    if (!clipboard.current) {
      toast.error("无复杂内容");
    } else {
      toast.dismiss();
      const clones = await clipboard.current.clone();
      canvas?.discardActiveObject();
      clones.left = clones.left + 10;
      clones.top = clones.top + 10;
      clones.evented = true;
      if (canvas) {
        //如果复制当前对象是activeSelection，则遍历activeSelection中的每一个对象，并添加到canvas中
        if (clones.type === "activeSelection") {
          clones.canvas = canvas;
          clones.canvas.forEachObject((obj) => {
            canvas.add(obj);
          });
        } else {
          canvas.add(clones);
        }
      }
      clipboard.current.top = clipboard.current.top + 10;
      clipboard.current.left = clipboard.current.left + 10;
      canvas?.setActiveObject(clones);
      canvas?.requestRenderAll();
    }
  });
  return { copy, paste };
};
