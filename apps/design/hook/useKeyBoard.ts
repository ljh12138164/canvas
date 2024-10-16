import { useEffect } from "react";
import * as fabric from "fabric";
import { useEvent } from "react-use";
interface UseKeyBoardProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => Promise<void>;
  pasty: () => void;
}
const useKeyBoard = ({
  canvas,
  undo,
  redo,
  save,
  copy,
  pasty,
}: UseKeyBoardProps) => {
  useEvent("keydown", (e) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const isBackspace = e.key === "Backspace";
    const isinput = ["INPUT", "TEXTAREA"].includes(
      (e.target as HTMLElement)?.tagName
    );
    if (isinput) return;
    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }
    if (isCtrl) {
      e.preventDefault();
      if (e.key === "z") {
        undo();
      }
      if (e.key === "y") {
        redo();
      }
      if (e.key === "s") {
        save(true);
      }
      if (e.key === "c") {
        copy();
      }
      if (e.key === "v") {
        pasty();
      }
    }
  });
};

export default useKeyBoard;
