"use client";
import useCanvas from "@/hook/useCanvas";
import useCanvasEvent from "@/hook/useCanvasEvent";
import useResponse from "@/hook/useResponse";
import {
  FILL_COLOR,
  FONT_ALIGN,
  FONT_FAMILY,
  FONT_ITALICS,
  FONT_SIZE,
  FONT_THOUGHT,
  FONT_UNDERLINE,
  FONT_WEIGHT,
  FontStyle,
  OPACITY,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  Tool,
} from "@/types/Edit";
import { useMemoizedFn } from "ahooks";
import * as fabric from "fabric";
import { FabricObject } from "fabric";
import { useEffect, useMemo, useRef, useState } from "react";
import ColorSoiberbar from "../_components/EditComponents/ColorSiberbar";
import NavBar from "../_components/EditComponents/NavBar";
import ShapeSidle from "../_components/EditComponents/ShapeSidle";
import SiderBar from "../_components/EditComponents/SiderBar";
import Tools from "../_components/EditComponents/Tools";
import { buildEditor, FontWeightType } from "@/store/editor";
import TextSidebar from "../_components/EditComponents/TextSidebar";
import ImageSiderbar from "../_components/EditComponents/ImageSiderbar";
import { useToast } from "@/hooks/use-toast";
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
  const { init } = useCanvas();
  const [tool, setTool] = useState<Tool>(Tool.Layout);
  //实例对象
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [contain, setContain] = useState<HTMLDivElement | null>(null);
  //选择的对象
  const [selectedObject, setSelectedObject] = useState<fabric.Object[] | null>(
    null
  );
  //颜色形状初始化
  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
  //边框形状
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);
  const [opacity, setOpacity] = useState<number>(OPACITY);

  //字体
  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);
  const [fontWeight, setFontWeight] = useState<FontWeightType>(FONT_WEIGHT);
  const [fontThought, setFontThickness] = useState<boolean>(FONT_THOUGHT);
  const [fontUnderline, setFontUnderline] = useState<boolean>(FONT_UNDERLINE);
  const [fontItalics, setFontItalics] = useState<FontStyle>(FONT_ITALICS);
  const [fontAlign, setFontAlign] =
    useState<fabric.Textbox["textAlign"]>(FONT_ALIGN);
  const [fontSize, setFontSize] = useState<number>(FONT_SIZE);

  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useCanvasEvent({
    canvas,
    setSelectedObject,
    tool,
    setTool,
  });

  const onChangeActive = useMemoizedFn((tools: Tool) => {
    if (tools === tool) {
      return setTool(Tool.Select);
    }
    if (tools === Tool.Draw) {
      //TODO: 清空画布
    }
    if (tool === Tool.Draw) {
    }
    setTool(tools);
  });

  const editor = useMemo(() => {
    if (canvas)
      return buildEditor({
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        selectedObject,
        strokeDashArray,
        opacity,
        fontFamily,
        fontWeight,
        fontThought,
        fontItalics,
        fontUnderline,
        fontAlign,
        fontSize,
        imageLoading,
        setImageLoading,
        setFontSize,
        setFontAlign,
        setFontUnderline,
        setFontItalics,
        setFontThickness,
        setFontWeight,
        setFontFamily,
        setOpacity,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        setStrokeDashArray,
      });
    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObject,
    strokeDashArray,
    opacity,
    fontFamily,
    fontWeight,
    fontThought,
    fontItalics,
    fontUnderline,
    fontAlign,
    fontSize,
    imageLoading,
  ]);

  const containEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
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
      <NavBar activeTool={tool} onChangeTool={onChangeActive}></NavBar>
      <div className="h-full w-full  flex-1 flex  transition-all duration-100 ease-in-out">
        <SiderBar
          acitiveTool={tool}
          onChangeActiveTool={onChangeActive}
        ></SiderBar>
        <ShapeSidle
          editor={editor}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></ShapeSidle>
        <TextSidebar
          editor={editor}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></TextSidebar>
        <ImageSiderbar
          editor={editor}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></ImageSiderbar>
        <ColorSoiberbar
          editor={editor}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></ColorSoiberbar>
        <main className="flex-1 h-full w-full flex flex-col overflow-hidden">
          <Tools
            editor={editor}
            activeTool={tool}
            onChangeActiveTool={onChangeActive}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          ></Tools>
          <section
            className="flex flex-col relative flex-1 overflow-hidden"
            ref={containEl}
          >
            <canvas ref={canvasEl}></canvas>
          </section>
        </main>
      </div>
    </div>
  );
}
