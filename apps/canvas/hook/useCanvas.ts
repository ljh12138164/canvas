import { useCallback } from "react";

export const useCanvas = () => {
  const init = useCallback(
    ({
      initCanvas,
      initContainer,
    }: {
      initCanvas: any;
      initContainer: HTMLDivElement;
    }) => {
      console.log(initCanvas, initContainer);
    },
    []
  );
  return { init };
};
