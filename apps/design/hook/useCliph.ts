import { useMemoizedFn } from "ahooks";
import * as fabric from "fabric";
import { useRef } from "react";
import toast from "react-hot-toast";
interface UserClipboard {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UserClipboard) => {
  const clipboard: fabric.FabricObject[] = [];

  const copy = useMemoizedFn(async () => {
    toast.dismiss();
    canvas?.getActiveObjects()?.forEach(async (item, index) => {
      const value = await item.clone();
      value.left = value.left + 10 * (index + 1);
      value.top = value.top + 10 * (index + 1);
      value.evented = true;
      clipboard.push(value);
      canvas?.add(value);
      canvas?.setActiveObject(value);
    });
    canvas?.requestRenderAll();
    toast.success("复制成功");
    // }
  });
  return { copy };
};
