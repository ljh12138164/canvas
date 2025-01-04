"use client";
import ColorSoiberbar from "@/app/_components/EditComponents/ColorSiberbar";
import Footer from "@/app/_components/EditComponents/Footer";
import ImageSiderbar from "@/app/_components/EditComponents/ImageSiderbar";
import NavBar from "@/app/_components/EditComponents/NavBar";
import ShapeSidle from "@/app/_components/EditComponents/ShapeSidle";
import SiderBar from "@/app/_components/EditComponents/SiderBar";
import TextSidebar from "@/app/_components/EditComponents/TextSidebar";
import Tools from "@/app/_components/EditComponents/Tools";
import { useBoardAutoSaveQuery } from "@/app/_hook/query/useBoardQuery";
import useCanvas from "@/app/_hook/useCanvas";
import useCanvasEvent from "@/app/_hook/useCanvasEvent";
import { useClipboard } from "@/app/_hook/useCliph";
import useHistoty from "@/app/_hook/useHistory";
import useKeyBoard from "@/app/_hook/useKeyBoard";
import { useLoading } from "@/app/_hook/useLoding";
import useResponse from "@/app/_hook/useResponse";
import { useWindowEvent } from "@/app/_hook/useWindowEvent";
import { buildEditor } from "@/app/_store/editor";
import { Board } from "@/app/_types/board";
import {
  CANVAS_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FILL_COLOR,
  FONT_ALIGN,
  FONT_FAMILY,
  FONT_ITALICS,
  FONT_SIZE,
  FONT_THOUGHT,
  FONT_UNDERLINE,
  FONT_WEIGHT,
  FontStyle,
  FontWeightType,
  JSON_KEY,
  OPACITY,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  Tool,
} from "@/app/_types/Edit";
import { useMemoizedFn } from "ahooks";
import * as fabric from "fabric";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
//创建文档
const ydoc = new Y.Doc();
// 画布服务器
const Canvas = ({ token, data }: { token: string; data: Board }) => {
  const initWidth = useRef(data.width);
  const initHeight = useRef(data.height);
  const initState = useRef(data.json);
  const { mutate, isPending } = useBoardAutoSaveQuery({ id: data.id, token });

  const debounceMutate = useMemoizedFn(
    debounce((data: { json: string; width: number; height: number }) => {
      mutate({ ...data });
    }, 1000)
  );
  const { init } = useCanvas({
    initWidth: initWidth.current as number,
    initHeight: initHeight.current as number,
  });

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
  //图片
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageFilter, setImageFilter] = useState<string[]>([]);

  //画布操作
  const [drewColor, setDrewColor] = useState<string>(STROKE_COLOR);
  const [drawWidth, setDrawWidth] = useState<number>(STROKE_WIDTH);
  //画布大小
  const [canvasWidth, setCanvasWidth] = useState<number>(CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState<number>(CANVAS_HEIGHT);
  //画布颜色
  const [canvasColor, setCanvasColor] = useState<string>(CANVAS_COLOR);
  const { authZoom } = useResponse({ canvas, contain }) as { authZoom: any };
  //画布历史
  const { save, canRedo, canUndo, undo, redo, setHitoryIndex, canvasHistory } =
    useHistoty({ canvas, authZoom, debounceMutate });
  // // indexDB
  // const yIndexDb = new Y.IndexedDBPersistence(data.id, ydoc);
  // yIndexDb.whenSynced.then(() => {
  //   console.log("Y-doc is synced with IndexedDB");
  // });

  // 协同
  useEffect(() => {
    const websocket = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL!,
      data.id,
      ydoc
    );
    return () => {
      websocket.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 画布事件
  useCanvasEvent({
    canvas,
    tool,
    save,
    setSelectedObject,
    setTool,
  });

  const { copy, pasty } = useClipboard({ canvas });
  // 键盘事件
  useKeyBoard({
    canvas,
    undo,
    redo,
    save,
    copy,
    pasty,
  });
  useWindowEvent();
  const onChangeActive = (tools: Tool) => {
    if (tools === Tool.Draw) {
      editor()?.enableDraw();
    }
    if (tool === Tool.Draw) {
      editor()?.disableDraw();
    }
    if (tools === tool) {
      return setTool(Tool.Select);
    }
    setTool(tools);
  };
  //编辑器
  const editor = () => {
    if (canvas) {
      const value = buildEditor({
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
        imageFilter,
        drewColor,
        drawWidth,
        canvasWidth,
        canvasHeight,
        canvasColor,
        canvasHistory: canvasHistory.current,
        pasty,
        save,
        canRedo,
        canUndo,
        undo,
        redo,
        setHitoryIndex,
        setCanvasHeight,
        setCanvasColor,
        setCanvasWidth,
        authZoom,
        setDrawWidth,
        setDrewColor,
        copy,
        setImageFilter,
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
      return value;
    }
    return undefined;
  };
  const containEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  //初始化
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

    //初始化
    const currentState = canvas.toObject(JSON_KEY);
    canvasHistory.current = [currentState];
    setHitoryIndex(0);
    return () => {
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init]);
  // 初始化
  useLoading({
    canvas,
    initState,
    canvasHistory,
    authZoom,
    setHistoryIndex: setHitoryIndex,
  });
  return (
    <div
      className="h-full w-full flex flex-col items-center relative bg-slate-100"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <NavBar
        token={token}
        isPending={isPending}
        editor={editor()}
        activeTool={tool}
        onChangeTool={onChangeActive}
      ></NavBar>
      <div className="h-full w-full  flex-1 flex  transition-all duration-100 ease-in-out">
        <SiderBar
          acitiveTool={tool}
          onChangeActiveTool={onChangeActive}
        ></SiderBar>
        <TextSidebar
          editor={editor()}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></TextSidebar>
        <ShapeSidle
          editor={editor()}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></ShapeSidle>
        <ImageSiderbar
          token={token}
          editor={editor()}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></ImageSiderbar>
        <ColorSoiberbar
          editor={editor()}
          activeTool={tool}
          onChangeActive={onChangeActive}
        ></ColorSoiberbar>
        <main className="flex-1 h-full w-full flex flex-col overflow-hidden">
          <Tools
            editor={editor()}
            activeTool={tool}
            onChangeActiveTool={onChangeActive}
            key={JSON.stringify(editor()?.canvas.getActiveObject())}
          ></Tools>
          <section
            className="flex flex-col relative flex-1 overflow-hidden"
            ref={containEl}
          >
            <canvas ref={canvasEl}></canvas>
          </section>
          <Footer editor={editor()}></Footer>
        </main>
      </div>
    </div>
  );
};

export default Canvas;