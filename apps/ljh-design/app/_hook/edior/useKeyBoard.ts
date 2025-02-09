import type { InitFabicObject } from '@/app/_types/Edit';
import * as fabric from 'fabric';
import { useEvent } from 'react-use';
interface UseKeyBoardProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => Promise<void>;
  pasty: () => void;
  isPending?: boolean;
}
const useKeyBoard = ({ canvas, undo, redo, save, copy, pasty, isPending }: UseKeyBoardProps) => {
  useEvent('keydown', (e) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const isBackspace = e.key === 'Backspace';
    const isinput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
    if (isinput) return;
    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }
    if (e.key === 'Delete') {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }
    if (isCtrl) {
      e.preventDefault();
      if (e.key === 'z') {
        undo();
      }
      if (e.key === 'y') {
        redo();
      }
      if (e.key === 's') {
        if (isPending) return;
        save(true);
      }
      if (e.key === 'c') {
        copy();
      }
      if (e.key === 'v') {
        pasty();
      }
      if (e.key === 'a') {
        e.preventDefault();
        canvas?.discardActiveObject();
        const allObject = canvas
          ?.getObjects()
          .filter((item) => (item as InitFabicObject).name !== 'board');

        canvas?.setActiveObject(new fabric.ActiveSelection(allObject, { canvas }));
        canvas?.renderAll();
      }
    }
  });
};

export default useKeyBoard;
