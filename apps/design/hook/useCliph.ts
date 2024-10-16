import { useMemoizedFn } from "ahooks";
import * as fabric from "fabric";
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
      toast.success("复制成功");
    });
    // }
  });
  const pasty = () => {
    if (clipboard.length === 0) return;
    clipboard.forEach((value) => {
      canvas?.add(value);
      canvas?.setActiveObject(value);
      canvas?.requestRenderAll();
    });
  };
  return { copy, pasty };
};
