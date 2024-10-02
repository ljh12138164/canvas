"use client";
import * as fabric from "fabric";
import { FabricObject } from "fabric";
import { useEffect, useRef, useState } from "react";
import useCanvas from "@/hook/useCanvas";
import useResponse from "@/hook/useResponse";
import NavBar from "../_components/EditComponents/NavBar";
import SiderBar from "../_components/EditComponents/SiderBar";
import ToolBar from "../_components/EditComponents/ToolBar";
FabricObject.prototype.set({
  transparentCorners: false,
  cornerColor: "#FFF",
  cornerStyle: "circle",
  borderColor: "#3b82f6",
  borderScaleFactor: 1.5,
  borderOpacityWhenMoving: 1,
  cornerStorkeColor: "#3b82f6",
});
export default function Home() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [contain, setContain] = useState<HTMLDivElement | null>(null);
  const containEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { init } = useCanvas();
  useResponse({ canvas, contain });
  useEffect(() => {
    if (!canvasEl.current) return;
    const canvas = new fabric.Canvas(canvasEl.current as HTMLCanvasElement, {
      preserveObjectStacking: true,
      controlsAboveOverlay: true,
    });

    init({
      initCanvas: canvas,
      initContainer: containEl.current as HTMLDivElement,
    });
    setCanvas(canvas);
    setContain(containEl.current);
    return () => {
      canvas.dispose();
    };
  }, [init]);
  return (
    <div
      className="h-full w-full flex flex-col items-center relative bg-slate-100"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <NavBar></NavBar>
      <div
        ref={containEl}
        className="h-[96dvh] absolute left-0 top-[3rem] flex xl:w-full w-[110dvw] transition-all duration-100 ease-in-out"
      >
        <SiderBar></SiderBar>
        <main className="flex flex-col relative flex-1 overflow-auto">
          <ToolBar></ToolBar>
          <canvas ref={canvasEl}></canvas>
        </main>
      </div>
    </div>
  );
}
