"use client";
import * as fabric from "fabric";
import { FabricObject } from "fabric";
import { useEffect, useMemo, useRef, useState } from "react";
import useCanvas from "@/hook/useCanvas";
import useResponse from "@/hook/useResponse";
import NavBar from "../_components/EditComponents/NavBar";
import SiderBar from "../_components/EditComponents/SiderBar";
import ToolBar from "../_components/EditComponents/ToolBar";
import {
  CRICLE_OPTION,
  DIAMOD_HEGHT,
  DIAMOD_OPTION,
  DIAMOD_WIDTH,
  Edit,
  FILL_COLOR,
  RECTANGLE_OPTION,
  STROKE_COLOR,
  STROKE_WIDTH,
  Tool,
  TRIANGLE_OPTION,
} from "@/types/Edit";
import { useMemoizedFn } from "ahooks";
import ShapeSidle from "../_components/EditComponents/ShapeSidle";
import useCanvasEvent from "@/hook/useCanvasEvent";
import Tools from "../_components/EditComponents/Tools";
FabricObject.prototype.set({
  transparentCorners: false,
  cornerColor: "#FFF",
  cornerStyle: "circle",
  borderColor: "#3b82f6",
  borderScaleFactor: 1.5,
  borderOpacityWhenMoving: 1,
  cornerStorkeColor: "#3b82f6",
});
interface buildEditorProps {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}
const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
}: buildEditorProps): Edit => {
  const getWorkspace = () =>
    canvas
      .getObjects()
      //@ts-ignore
      .find((item: fabric.SerializedObjectProps) => item.name === "board");

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    //居中
    const centers = workspace?.getCenterPoint();
    canvas._centerObject(object, centers as fabric.Point);
    // canvas.centerObject(object);
  };
  return {
    strokeColor,
    strokeWidth,
    fillColor,
    canvas,
    //颜色
    setFillColor: (color: string) => {
      setFillColor(color);
      canvas.getActiveObjects()?.forEach((obj) => {
        obj.set({ fill: color });
      });
    },
    // 线条宽度
    setStrokeWidth: (width: number) => {
      setStrokeWidth(width);
      canvas.getActiveObjects()?.forEach((obj) => {
        obj.set({ strokeWidth: width });
      });
    },
    setStrokeColor: (color: string) => {
      setStrokeColor(color);
      canvas.getActiveObjects()?.forEach((obj) => {
        //如果是文本

        if (
          obj.type === "text" ||
          obj.type === "i-text" ||
          obj.type === "textbox"
        ) {
          obj.set({ fill: color });
          return;
        }
        obj.set({ stroke: color });
      });
    },
    //园
    addCircle: () => {
      const circle = new fabric.Circle({
        ...CRICLE_OPTION,
      });
      center(circle);
      canvas.add(circle);
      //选中对象
      canvas.setActiveObject(circle);
    },
    //矩形
    addRectangle: () => {
      const rect = new fabric.Rect({
        ...RECTANGLE_OPTION,
      });
      center(rect);
      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
    //圆角矩形
    addSoftRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTION,
        rx: 10,
        ry: 10,
      });
      center(rectangle);
      canvas.add(rectangle);
      canvas.setActiveObject(rectangle);
    },
    //三角形
    addTriangle: () => {
      const triangle = new fabric.Triangle({
        ...TRIANGLE_OPTION,
      });
      center(triangle);
      canvas.add(triangle);
      canvas.setActiveObject(triangle);
    },
    addRotateTriangle: () => {
      const triangle = new fabric.Triangle({
        ...TRIANGLE_OPTION,
        //180反转
        angle: 180,
      });
      center(triangle);
      canvas.add(triangle);
      canvas.setActiveObject(triangle);
    },
    addDiamod: () => {
      const diamod = new fabric.Polygon(
        [
          {
            x: DIAMOD_WIDTH / 2,
            y: 0,
          },
          {
            x: DIAMOD_WIDTH,
            y: DIAMOD_HEGHT / 2,
          },
          { x: DIAMOD_WIDTH / 2, y: DIAMOD_HEGHT },
          {
            x: 0,
            y: DIAMOD_WIDTH / 2,
          },
        ],
        {
          ...DIAMOD_OPTION,
        }
      );
      center(diamod);
      canvas.add(diamod);
      canvas.setActiveObject(diamod);
    },
  };
};
export default function Home() {
  const { init } = useCanvas();
  const [tool, setTool] = useState<Tool>(Tool.Layout);
  //实例对象
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [contain, setContain] = useState<HTMLDivElement | null>(null);
  //选择的对象
  const [_, setSelectedObject] = useState<fabric.Object[] | null>(null);
  //颜色形状初始化
  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);

  useCanvasEvent({
    canvas,
    setSelectedObject,
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
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
      });
    return undefined;
  }, [canvas, fillColor, strokeColor, strokeWidth]);

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
      <div className="h-[90dvh] absolute left-0 top-[4rem] flex xl:w-full w-[110dvw] transition-all duration-100 ease-in-out">
        <SiderBar
          acitiveTool={tool}
          onChangeActiveTool={onChangeActive}
        ></SiderBar>
        <ShapeSidle
          editor={editor}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></ShapeSidle>
        <Tools
          editor={editor}
          activeTool={tool}
          onChangeActiveTool={onChangeActive}
          key={JSON.stringify(editor?.canvas.getActiveObject())}
        ></Tools>
        <main
          className="flex flex-col relative flex-1 overflow-hidden"
          ref={containEl}
        >
          <canvas ref={canvasEl}></canvas>
        </main>
      </div>
    </div>
  );
}
