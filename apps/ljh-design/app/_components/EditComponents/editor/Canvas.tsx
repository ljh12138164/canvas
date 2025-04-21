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
import { useBoardAutoSaveQuery } from '@/app/_hook/query/useBoardQuery';
import { buildEditor } from '@/app/_store/editor';
import { useSave } from '@/app/_store/save';
import type { Edit, EditType } from '@/app/_types/Edit';
import {
  CANVAS_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  // type DefalutUser,
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
import { debounce, throttle } from 'lodash-es';
// import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TemplateSiderbar } from '../asider/TemplateSiderbar';
// 画布服务器
const Canvas = ({ user, data, type }: { user: Sessions; data?: Board; type: EditType }) => {
  const { setCloudSave } = useSave();
  // 初始化
  const [isLoading, setLoading] = useState<boolean>(true);
  // 默认图片
  const defaultImage = useRef(data?.image as string);
  // const userData = useRef<DefalutUser>({
  //   id: user.user.id,
  //   name: user.user.user_metadata.name,
  //   color: getUserColor(user.user.id),
  //   image: user.user.user_metadata.image,
  // });
  // 画板初始数据
  const initWidth = useRef(data?.width);
  const initHeight = useRef(data?.height);
  const initState = useRef(data?.json);
  // 画布容器
  const containEl = useRef<HTMLDivElement>(null);
  // 画布
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { isPending, mutate } = useBoardAutoSaveQuery({ id: data?.id });

  // 保存
  const debounceMutate = useMemo(() => {
    if (type === 'material') return;
    if (!data?.id) return;
    // 使用节流来确保至少每10秒保存一次
    const throttledSave = throttle(
      (newData) => {
        if (isPending) return;
        // 调用保存的接口
        mutate(
          {
            json: {
              json: newData.json,
              isTemplate: type === 'template',
              defaultImage: defaultImage.current,
              image: newData.image,
              width: newData.width,
              height: newData.height,
              id: data.id,
            },
          },
          {
            onSuccess: (data) => {
              defaultImage.current = data.image;
              setCloudSave(true);
            },
          },
        );
      },
      10000,
      // 节流 先执行一次，再每隔10秒执行一次
      { leading: true, trailing: true },
    );

    // 使用防抖来合并频繁的更新
    const debouncedSave = debounce(throttledSave, 5000, { maxWait: 10000 });

    return debouncedSave;
  }, [data?.id, isPending, mutate, type]);

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
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject[] | null>(null);
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
  const [canvasWidth, setCanvasWidth] = useState<number>(Number(data?.width) || CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState<number>(Number(data?.height) || CANVAS_HEIGHT);
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
    setLoading,
    isLoading,
    canvasHistory,
    authZoom,
    setHistoryIndex: setHitoryIndex,
  });
  // 协同hooks
  // const { userState, yMaps, websockets } = useYjs({
  //   data,
  //   canvas,
  //   user,
  //   userData,
  // });
  // 画布事件
  useCanvasEvent({
    // yMaps,
    // userState,
    canvas,
    isLoading,
    tool,
    save,
    user,
    setSelectedObject,
    setTool,
    // websockets,
    // userData,
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
    isPending,
  });

  // 工具栏
  const onChangeActive = useMemoizedFn((tools: Tool) => {
    if (tools === Tool.Draw) editor()?.enableDraw();

    if (tool === Tool.Draw) editor()?.disableDraw();
    if (tools === tool) setTool(Tool.Select);
    setTool(tools);
  });
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
        // yMaps,
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
  // 画布事件
  useWindowEvent(editor() as Edit | undefined);
  //初始化
  useEffect(() => {
    if (!canvasEl.current) return;
    const canvas = new fabric.Canvas(canvasEl.current, {
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

  // 在组件卸载时清理
  useEffect(() => {
    return () => {
      debounceMutate?.cancel?.();
    };
  }, [debounceMutate]);

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
        type={type}
        onChangeTool={onChangeActive}
        // userState={userState}
      />
      <div className="h-full w-full  flex-1 flex  transition-all duration-100 ease-in-out">
        <SiderBar
          acitiveTool={tool}
          onChangeActiveTool={onChangeActive}
          type={type}
          editor={editor()}
        />
        <TextSidebar editor={editor()} activeTool={tool} onChangeActive={onChangeActive} />
        <ShapeSidle
          editor={editor()}
          activeTool={tool}
          onChangeActive={onChangeActive}
          userId={user.user.id}
        />
        <ImageSiderbar
          userId={user.user.id}
          editor={editor()}
          activeTool={tool}
          onChangeActive={onChangeActive}
        />
        <ColorSoiberbar editor={editor()} activeTool={tool} onChangeActive={onChangeActive} />
        {type !== 'material' && (
          <TemplateSiderbar editor={editor()} activeTool={tool} onChangeActive={onChangeActive} />
        )}
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
