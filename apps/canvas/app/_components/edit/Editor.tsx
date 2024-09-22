"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric"; // v6
import { useCanvas } from "@/hook/useCanvas";
import { useResize } from "@/hook/useResize";
const Editor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [contain, setContain] = useState<HTMLDivElement | null>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const constainEl = useRef<HTMLDivElement>(null);
  useResize(canvas, contain);
  const createRect = useCallback(
    (width: number, height: number, canvas: fabric.Canvas) => {
      const rect = new fabric.Rect({
        width,
        height,
        fill: "red",
      });

      canvas.add(rect);
    },
    []
  );
  const { init } = useCanvas();
  useEffect(() => {
    if (fabric.Canvas) {
      //设置选择边框颜色

      const canvas = new fabric.Canvas(canvasEl.current as HTMLCanvasElement, {
        preserveObjectStacking: true,
        controlsAboveOverlay: true,
      });
      fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        borderOpacityWhenMoving: 1,
        cornerStorkeColor: "#3b82f6",
      });
      init({
        initCanvas: canvas,
        initContainer: constainEl.current as HTMLDivElement,
      });
      setCanvas(canvas);
      setContain(constainEl.current as HTMLDivElement);
      return () => {
        canvas.dispose();
      };
    }
  }, [init, createRect]);
  return (
    <div className="flex h-full">
      <div ref={constainEl} className="flex-1 h-full bg-slate-400">
        <canvas ref={canvasEl} />;
      </div>
    </div>
  );
};

export default Editor;
