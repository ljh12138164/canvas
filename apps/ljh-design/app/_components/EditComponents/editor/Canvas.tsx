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
import useCanvasEvent from '@/app/_hook/edior/useCanvasEvent';
import { useClipboard } from '@/app/_hook/edior/useCliph';
import useHistoty from '@/app/_hook/edior/useHistory';
import useKeyBoard from '@/app/_hook/edior/useKeyBoard';
import { useLoading } from '@/app/_hook/edior/useLoding';
import useResponse from '@/app/_hook/edior/useResponse';
import { useWindowEvent } from '@/app/_hook/edior/useWindowEvent';
import { useYjs } from '@/app/_hook/edior/useYjs';
import { useBoardAutoSaveQuery } from '@/app/_hook/query/useBoardQuery';
import { getUserColor } from '@/app/_lib/utils';
import { buildEditor } from '@/app/_store/editor';
import {
  CANVAS_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type DefalutUser,
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
import type { Sessions } from '@/app/_types/user';
import { useMemoizedFn } from 'ahooks';
import * as fabric from 'fabric';
import { useEffect, useRef, useState } from 'react';

// 画布服务器
const Canvas = ({ user, data }: { user: Sessions; data: Board }) => {
  const userData = useRef<DefalutUser>({
    id: user.user.id,
    name: user.user.user_metadata.name,
    color: getUserColor(user.user.id),
    image: user.user.user_metadata.image,
  });
  // 画板初始数据
  const initWidth = useRef(data.width);
  const initHeight = useRef(data.height);
  const initState = useRef(data.json);
  // 画布容器
  const containEl = useRef<HTMLDivElement>(null);
  // 画布
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { isPending } = useBoardAutoSaveQuery({ id: data.id });

  const debounceMutate = useMemoizedFn(() => {});
  // debounce((data: { json: string; width: number; height: number }) => {
  //   mutate({ ...data });
  // }, 1000)

  // 画布初始化
  const { init } = useCanvas({
    initWidth: initWidth.current as number,
    initHeight: initHeight.current as number,
  });

  const [tool, setTool] = useState<Tool>(Tool.Layout);
  //实例对象
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [contain, setContain] = useState<HTMLDivElement | null>(null);
  //选择的对象
  const [selectedObject, setSelectedObject] = useState<fabric.Object[] | null>(null);
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
  const [canvasWidth, setCanvasWidth] = useState<number>(+data.width || CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState<number>(+data.height || CANVAS_HEIGHT);
  //画布颜色
  const [canvasColor, setCanvasColor] = useState<string>(CANVAS_COLOR);
  const { authZoom } = useResponse({ canvas, contain }) as { authZoom: any };
  //画布历史
  const { save, canRedo, canUndo, undo, redo, setHitoryIndex, canvasHistory } = useHistoty({
    canvas,
    authZoom,
    debounceMutate,
  });
  // 初始化
  useLoading({
    canvas,
    initState,
    canvasHistory,
    authZoom,
    setHistoryIndex: setHitoryIndex,
  });
  // 协同hooks
  const { userState, yMaps, websockets } = useYjs({
    data,
    canvas,
    user,
    userData,
  });
  // 画布事件
  useCanvasEvent({
    canvas,
    yMaps,
    tool,
    userState,
    save,
    user,
    setSelectedObject,
    setTool,
    websockets,
    userData,
  });
  // 画布剪切板
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
  // 画布事件
  useWindowEvent();
  // 工具栏
  const onChangeActive = (tools: Tool) => {
    if (tools === Tool.Draw) editor()?.enableDraw();

    if (tool === Tool.Draw) editor()?.disableDraw();
    if (tools === tool) setTool(Tool.Select);
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
        authZoom,
        yMaps,
        userId: user.user.id,
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

  //初始化
  useEffect(() => {
    if (!canvasEl.current) return;
    const canvas = new fabric.Canvas(canvasEl.current as HTMLCanvasElement, {
      //保持对象的堆叠顺序
      preserveObjectStacking: true,
      // 控制点（如旋转、缩放的手柄）会显示在画布覆盖层的上方
      controlsAboveOverlay: true,
      // 为高分辨率显示器（如 Retina 屏幕）启用缩放支持
      enableRetinaScaling: true,
      // 启用右键点击事件,允许你处理画布上的右键菜单事件,用于实现自定义右键菜单功能
      fireRightClick: true,
      // 阻止浏览器默认的右键上下文菜单
      stopContextMenu: true,
    });
    // 阻止浏览器默认的右键上下文菜单
    canvas.wrapperEl.addEventListener(
      'contextmenu',
      (e) => {
        e.preventDefault();
        return false;
      },
      false,
    );

    init({
      initCanvas: canvas,
      initContainer: containEl.current as HTMLDivElement,
    });
    setCanvas(canvas);
    setContain(containEl.current);

    //初始化
    // const currentState = canvas.toObject(JSON_KEY);
    // canvasHistory.current = [currentState];
    // setHitoryIndex(0);
    return () => {
      canvas.dispose();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init]);

  return (
    <div
      className="h-full w-full flex flex-col items-center relative bg-slate-100"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      <NavBar
        userId={user.user.id}
        isPending={isPending}
        editor={editor()}
        activeTool={tool}
        onChangeTool={onChangeActive}
        userState={userState}
      />
      <div className="h-full w-full  flex-1 flex  transition-all duration-100 ease-in-out">
        <SiderBar acitiveTool={tool} onChangeActiveTool={onChangeActive} />
        <TextSidebar editor={editor()} activeTool={tool} onChangeActive={onChangeActive} />
        <ShapeSidle editor={editor()} activeTool={tool} onChangeActive={onChangeActive} />
        <ImageSiderbar
          userId={user.user.id}
          editor={editor()}
          activeTool={tool}
          onChangeActive={onChangeActive}
        />
        <ColorSoiberbar editor={editor()} activeTool={tool} onChangeActive={onChangeActive} />
        <main className="flex-1 h-full w-full flex flex-col overflow-hidden">
          <Tools
            editor={editor()}
            activeTool={tool}
            onChangeActiveTool={onChangeActive}
            key={JSON.stringify(editor()?.canvas.getActiveObject())}
          />
          <section className="flex flex-col relative flex-1 overflow-hidden" ref={containEl}>
            <canvas ref={canvasEl} />
          </section>
          <Footer editor={editor()} />
        </main>
      </div>
    </div>
  );
};

export default Canvas;
