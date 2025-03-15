import { getSelectedText } from '@/app/_lib/utils';
import type * as fabric from 'fabric';
import { useRef } from 'react';
import toast from 'react-hot-toast';
interface UserClipboard {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UserClipboard) => {
  const clipboard = useRef<fabric.FabricObject[]>([]);

  const copy = async () => {
    if (!canvas?.getActiveObjects().length) {
      //
      const text = getSelectedText();
      navigator.clipboard.writeText(text ?? '');
      return;
    }
    toast.dismiss();
    clipboard.current = [];
    canvas?.getActiveObjects()?.forEach(async (item, index) => {
      const value = await item.clone();
      value.left = value.left + 10 * (index + 1);
      value.top = value.top + 10 * (index + 1);
      value.evented = true;
      clipboard.current.push(value);
    });
    toast.success('复制成功');
  };
  const pasty = () => {
    if (clipboard.current.length === 0) return;
    clipboard.current.forEach(async (item, index, arr) => {
      const value = await item.clone();
      value.left = value.left + 10 * (index + 1);
      value.top = value.top + 10 * (index + 1);
      value.evented = true;
      arr[index] = value;
      canvas?.add(value);
      canvas?.setActiveObject(value);
      canvas?.requestRenderAll();
    });
  };
  return { copy, pasty };
};
