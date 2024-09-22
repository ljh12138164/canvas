"use client";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import useCanvas from "@/hook/useCanvas";
export default function Home() {
  const containEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { init } = useCanvas();
  useEffect(() => {
    if (!canvasEl.current) return;
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
      initContainer: containEl.current as HTMLDivElement,
    });
    return () => {
      canvas.dispose();
    };
  }, [init]);
  return (
    <div className="h-[100dvh] flex items-center justify-center">
      <div ref={containEl} className="h-full w-full">
        <canvas ref={canvasEl}></canvas>
      </div>
    </div>
  );
}
