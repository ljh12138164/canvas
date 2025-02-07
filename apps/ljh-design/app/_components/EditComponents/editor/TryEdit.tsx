'use client';
import ColorSoiberbar from '@/app/_components/EditComponents/asider/ColorSiberbar';
import ImageSiderbar from '@/app/_components/EditComponents/asider/ImageSiderbar';
import ShapeSidle from '@/app/_components/EditComponents/asider/ShapeSidle';
import TextSidebar from '@/app/_components/EditComponents/asider/TextSidebar';
import Footer from '@/app/_components/EditComponents/editor/Footer';
import NavBar from '@/app/_components/EditComponents/editor/NavBar';
import SiderBar from '@/app/_components/EditComponents/editor/SiderBar';
import Tools from '@/app/_components/EditComponents/editor/Tools';
import useCanvas from '@/app/_hook/edior/useCanvas';
import { useClipboard } from '@/app/_hook/edior/useCliph';
import useHistoty from '@/app/_hook/edior/useHistory';
import useKeyBoard from '@/app/_hook/edior/useKeyBoard';
import { useLoading } from '@/app/_hook/edior/useLoding';
import useResponse from '@/app/_hook/edior/useResponse';
import { useWindowEvent } from '@/app/_hook/edior/useWindowEvent';
import { getTryBoardById, indexDBChange } from '@/app/_lib/utils';
import { buildEditor } from '@/app/_store/editor';
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
  type FontStyle,
  type FontWeightType,
  JSON_KEY,
  OPACITY,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  Tool,
} from '@/app/_types/Edit';
import type { Board } from '@/app/_types/board';
import { useMemoizedFn } from 'ahooks';
import * as fabric from 'fabric';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function TryEdit({ id, data }: { id: string; data: Board }) {
  const defaultData = useRef<Board>(data);
  const defaultJson = useRef<string>(data.json);
  const router = useRouter();
  const { init } = useCanvas({
    initHeight: defaultData.current?.height as number,
    initWidth: defaultData.current?.width as number,
  });
  const [isPending, setIsPending] = useState(false);
  const debounceMutate = useMemoizedFn(
    debounce(async (data: { json: string; width: number; height: number }) => {
      setIsPending(true);
      const dataed = await getTryBoardById(id);
      if (!dataed) {
        toast.error('数据不存在');
        return router.push('/try/board');
      }
      indexDBChange({
        type: 'edit',
        editData: {
          ...dataed,
          ...data,
          updated_at: new Date().toISOString(),
        },
      });
      setIsPending(false);
    }, 300),
  );
  const [tool, setTool] = useState<Tool>(Tool.Layout);
  //实例对象
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [contain, setContain] = useState<HTMLDivElement | null>(null);
  //选择的对象
  const [selectedObject] = useState<fabric.FabricObject[] | null>(null);
  //颜色形状初始化
  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
  //边框形状
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
  const [opacity, setOpacity] = useState<number>(OPACITY);
  //字体
  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);
  const [fontWeight, setFontWeight] = useState<FontWeightType>(FONT_WEIGHT);
  const [fontThought, setFontThickness] = useState<boolean>(FONT_THOUGHT);
  const [fontUnderline, setFontUnderline] = useState<boolean>(FONT_UNDERLINE);
  const [fontItalics, setFontItalics] = useState<FontStyle>(FONT_ITALICS);
  const [fontAlign, setFontAlign] = useState<fabric.Textbox['textAlign']>(FONT_ALIGN);
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
  const { authZoom } = useResponse({ canvas, contain });
  //画布颜色
  const { save, canRedo, canUndo, undo, redo, setHitoryIndex, canvasHistory } = useHistoty({
    canvas,
    authZoom,
    debounceMutate,
  });
  //TODO:
  // useCanvasEvent({
  //   canvas,
  //   tool,
  //   save,
  //   setSelectedObject,
  //   setTool,
  // });
  const { copy, pasty } = useClipboard({ canvas });
  useKeyBoard({
    canvas,
    undo,
    redo,
    save,
    copy,
    pasty,
  });
  useWindowEvent();
  const editor = canvas
    ? // @ts-ignore
      buildEditor({
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
      })
    : undefined;

  const onChangeActive = (tools: Tool) => {
    if (tools === Tool.Draw) {
      editor?.enableDraw();
    }
    if (tool === Tool.Draw) {
      editor?.disableDraw();
    }
    if (tools === tool) {
      return setTool(Tool.Select);
    }
    setTool(tools);
  };
  //编辑器
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
  }, []);
  useLoading({
    authZoom,
    canvas,
    initState: defaultJson,
    canvasHistory,
    setHistoryIndex: setHitoryIndex,
  });
  return (
    <div
      className="h-full w-full flex flex-col items-center relative bg-slate-100"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      {/* @ts-ignore */}
      <NavBar
        isPending={isPending}
        editor={editor}
        activeTool={tool}
        onChangeTool={onChangeActive}
      />
      <div className="h-full w-full flex-1 flex  transition-all duration-100 ease-in-out">
        {/* @ts-ignore */}
        <SiderBar acitiveTool={tool} onChangeActiveTool={onChangeActive} />
        <TextSidebar editor={editor} activeTool={tool} onChangeActive={onChangeActive} />
        <ShapeSidle editor={editor} activeTool={tool} onChangeActive={onChangeActive} />
        <ImageSiderbar editor={editor} activeTool={tool} onChangeActive={onChangeActive} />
        <ColorSoiberbar editor={editor} activeTool={tool} onChangeActive={onChangeActive} />
        <main className="flex-1 h-full w-full flex flex-col overflow-hidden">
          <Tools
            editor={editor}
            activeTool={tool}
            onChangeActiveTool={onChangeActive}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <section className="flex flex-col relative flex-1 overflow-hidden" ref={containEl}>
            <canvas ref={canvasEl} />
          </section>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
}
