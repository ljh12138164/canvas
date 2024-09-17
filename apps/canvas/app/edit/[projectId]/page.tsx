"use client";
import React, { useEffect, useRef } from "react";
import * as fabric from "fabric"; // v6
import { useCanvas } from "@/hook/useCanvas";

const FabricJSCanvas = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const constainEl = useRef<HTMLDivElement>(null);
  const { init } = useCanvas();
  useEffect(() => {
    if (fabric.Canvas) {
      const canvas = new fabric.Canvas(canvasEl.current as HTMLCanvasElement);
      init({
        initCanvas: canvas,
        initContainer: constainEl.current as HTMLDivElement,
      });
      return () => {
        canvas.dispose();
      };
    }
  }, [init]);
  return (
    <div
      className="h-[100dvh] flex flex-col"
      style={{ scrollbarWidth: "none" }}
    >
      <div ref={constainEl} className="flex-1 h-full">
        <canvas ref={canvasEl} />;
      </div>
    </div>
  );
};
export default FabricJSCanvas;
