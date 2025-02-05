import { center, getWorkspace } from '@/app/_lib/editor/editor';
import { type Effect, createFilter, downloadImage, isText } from '@/app/_lib/utils';
import {
  type AddObject,
  type Edit,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  type FontStyle,
  type FontWeightType,
  type InitFabicObject,
  JSON_KEY,
  OPACITY,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXTBOX_OPTION,
  type buildEditorProps,
} from '@/app/_types/Edit';
import * as fabric from 'fabric';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
//输入

interface FilterArrayEffect {
  name: string;
  effect: Effect;
}
//返回fabric类型
declare module 'fabric' {
  interface FabricImage {
    filtersArray: FilterArrayEffect[];
    id: string;
  }
  interface FabricObject {
    id: string;
    // 画布名称
    name?: string;
    FarbicType?: string;
    changeType?: string;
    changeClientId?: string;
    // 保存后将添加到数据库，初始化时将删除
    save?: boolean;
  }
  interface FabricObjectProps {
    id?: string;
    type?: string;
  }
}
//
export const buildEditor = ({
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
  canvasHistory,
  yMaps,
  userId,
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
  setDrewColor,
  setDrawWidth,
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
  setStrokeDashArray,
  setStrokeColor,
  setFillColor,
  setStrokeWidth,
}: buildEditorProps): Edit => {
  //生成保存选项
  const genertateSaveOption = () => {
    const { width, height, left, top } = getWorkspace(canvas) as fabric.Rect;
    return {
      width: width,
      height: height,
      left: left,
      top: top,
      multiplier: 1,
    };
  };
  // 保存svg
  const saveSvg = () => {
    const option = genertateSaveOption();
    const newoption = {
      ...option,
      width: option.width.toString(),
      height: option.height.toString(),
      left: option.left.toString(),
      top: option.top.toString(),
    };
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // 将画布中的图片转换为内联数据URL
    canvas.getObjects().forEach((obj) => {
      if (obj.type === 'image' && obj.get('src')) {
        const originalSrc = obj.get('src');
        const img = new Image();
        img.src = originalSrc;
        const canvas = document.createElement('canvas');
        canvas.width = obj.width;
        canvas.height = obj.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, obj.width, obj.height);
        const dataURL = canvas.toDataURL('image/png');
        obj?.set('src', dataURL);
      }
    });

    const dataUrl = canvas.toSVG({
      ...newoption,
      viewBox: {
        x: Number(newoption.left),
        y: Number(newoption.top),
        width: Number(newoption.width),
        height: Number(newoption.height),
      },
      encoding: 'UTF-8',
      suppressPreamble: false,
    });

    // 替换可能导致错误的字符
    const cleanedSvg = dataUrl.replace(/&(?!amp;|lt;|gt;|quot;|#39;)/g, '&amp;');

    const svgBlob = new Blob([cleanedSvg], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    downloadImage(svgUrl, 'svg');
    URL.revokeObjectURL(svgUrl);
    authZoom();
  };
  //保存png
  const savePng = (open?: boolean) => {
    const option = genertateSaveOption();
    // 设置画布缩放
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL({ ...option, format: 'png' });
    if (open) {
      // 创建一个临时的 blob URL
      const blob = dataURLtoBlob(dataUrl);
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.target = '_blank';
      a.click();

      // 清理 blob URL
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        a.remove();
      }, 100);
    } else {
      downloadImage(dataUrl, 'png');
    }
    authZoom();
  };

  // 辅助函数：将 data URL 转换为 Blob
  const dataURLtoBlob = (dataURL: string) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  //保存jpg
  const savejpg = () => {
    const option = genertateSaveOption();
    // 设置画布缩放
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL({ ...option, format: 'png' });
    downloadImage(dataUrl, 'jpg');
    authZoom();
  };
  //保存json
  const saveJson = () => {
    const dataUrl = canvas.toObject(JSON_KEY);
    // transformToTest(dataUrl);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, '\t'))}`;
    downloadImage(fileString, 'json');
    authZoom();
  };
  //加载json
  const loadFromJson = async (json: any, fn?: () => void) => {
    if (typeof json === 'string') await canvas.loadFromJSON(JSON.parse(json));
    else await canvas.loadFromJSON(json);
    authZoom();
    fn?.();
  };
  //添加到画布
  const addToCanvas = (object: fabric.Object) => {
    center(object, canvas);
    canvas.add(object);
    canvas.setActiveObject(object);
  };
  const fixImageSize = (imageObj: fabric.FabricImage) => {
    const workspace = getWorkspace(canvas);
    imageObj.scaleToWidth(workspace?.width || 0);
    imageObj.scaleToHeight(workspace?.height || 0);
  };
  //返回编辑器方法
  return {
    strokeColor,
    strokeWidth,
    fillColor,
    canvas,
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
    imageFilter,
    imageLoading,
    drewColor,
    drawWidth,
    canvasColor,
    canvasHeight,
    canvasWidth,
    canvasHistory,
    savePng,
    saveSvg,
    savejpg,
    saveJson,
    loadFromJson,
    pasty,
    canRedo,
    canUndo,
    undo,
    redo,
    // 设置历史索引
    setHitoryIndex,
    // 设置背景颜色
    setCanvasColor,
    // 响应式
    authZoom,
    // 清空画布
    clear: () => {
      canvas.getObjects().forEach((item) => {
        if (item.name !== 'board') canvas.remove(item);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
      save();
    },
    // 放大
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenterPoint();
      canvas.zoomToPoint(center, zoomRatio > 1 ? 1 : zoomRatio);
    },
    // 缩小
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenterPoint();
      //防止过小
      canvas.zoomToPoint(center, zoomRatio < 0.2 ? 0.2 : zoomRatio);
    },
    // 获取画布
    getWorkspace: () => getWorkspace(canvas) as InitFabicObject,
    // 改变画布大小
    changeSize: async (size: { width: number; height: number }) => {
      const workspace = getWorkspace(canvas);
      if (workspace) {
        setCanvasWidth(size.width);
        setCanvasHeight(size.height);
        workspace.width = size.width;
        workspace.height = size.height;
      }
      await authZoom();
      canvas.renderAll();
      save();
    },
    // 设置背景颜色
    changeBackground: (color: string) => {
      setCanvasColor(color);
      const workspace = getWorkspace(canvas);
      if (workspace) workspace.fill = color;

      canvas.renderAll();
      save();
    },
    // 复制
    copy,
    // 启用画笔
    enableDraw: () => {
      canvas.discardActiveObject();

      canvas.isDrawingMode = true;
      canvas.renderAll();

      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = strokeColor;
      }
    },
    // 设置画笔颜色
    setDrewColors: (color: string) => {
      if (canvas.freeDrawingBrush?.color) {
        canvas.freeDrawingBrush.color = color;
        setDrewColor(color);
      }
    },
    // 设置画笔宽度
    setDrewWidths: (width: number) => {
      if (canvas.freeDrawingBrush?.color) {
        setDrawWidth(width);
        canvas.freeDrawingBrush.width = width;
      }
    },
    // 禁用画笔
    disableDraw: () => {
      canvas.isDrawingMode = false;
    },
    // 获取滤镜
    getActiveFilter: () => {
      if (canvas?.getActiveObjects()?.[0]) {
        const value = canvas?.getActiveObjects()?.[0];
        if (value instanceof fabric.FabricImage) {
          return value.filtersArray.length > 0 ? value.filtersArray.map((item) => item.name) : [];
        }
      }
      return [];
    },
    // 获取滤镜索引
    getActiveFilterIndex: (filter: string) => {
      const value = canvas?.getActiveObjects()?.[0];
      if (value instanceof fabric.FabricImage) {
        return value.filtersArray.findIndex((item) => item.name === filter);
      }
      return -1;
    },
    // 获取滤镜效果
    getActiveFilterEffect: (filter: string) => {
      const value = canvas?.getActiveObjects()?.[0];
      if (value instanceof fabric.FabricImage) {
        return value.filtersArray.find((item) => item.name === filter)?.effect || null;
      }
      return null;
    },
    // 修复图片大小
    fixImageSize,
    //改变图片滤镜
    changeImageFilter: (filter: string) => {
      setImageFilter([...imageFilter, filter]);
      canvas.getActiveObjects().forEach((item: fabric.FabricObject) => {
        if (item.type === 'image') {
          const imageObj = item as fabric.FabricImage;
          //创建滤镜
          const effects = createFilter(filter);
          imageObj.filtersArray.push({ name: filter, effect: effects });
          // @ts-ignore
          imageObj.filters = imageObj.filtersArray[0]?.effect
            ? imageObj.filtersArray.map((item) => item.effect)
            : [];
          fixImageSize(imageObj);

          save();
          // 多种滤镜
          imageObj.applyFilters();
          canvas.renderAll();
        }
      });
    },
    //改变滤镜参数
    changeImageFilterSetting: (filter: string, value: Effect) => {
      if (!value) return;
      canvas.getActiveObjects().forEach((item: fabric.FabricObject) => {
        if (item.type === 'image') {
          const imageObj = item as fabric.FabricImage;
          imageObj.filtersArray = [
            ...imageObj.filtersArray.filter((item) => item.name !== filter),
            { name: filter, effect: value },
          ];
          // @ts-ignore
          imageObj.filters = imageObj.filtersArray[0]?.effect
            ? imageObj.filtersArray.map((item) => item.effect)
            : [];
          imageObj.applyFilters();
          canvas.renderAll();
        }
      });
    },
    // 删除滤镜
    deleteImageFilter: (filter: string) => {
      setImageFilter([...imageFilter].filter((item) => item !== filter));

      canvas.getActiveObjects().forEach((item: fabric.FabricObject) => {
        if (item.type === 'image') {
          const imageObj = item as fabric.FabricImage;
          imageObj.filtersArray = imageObj.filtersArray.filter((item) => item.name !== filter);
          imageObj.filters = imageObj.filtersArray[0]?.effect
            ? [imageObj.filtersArray[0]?.effect]
            : [];
          imageObj.applyFilters();
          canvas.renderAll();
        }
      });
      setImageFilter([]);
    },
    //添加图像
    addImage: async (value: string) => {
      toast.dismiss();
      toast.loading('添加中...');
      setImageLoading(true);
      const workspace = getWorkspace(canvas);
      const img = await fabric.FabricImage.fromURL(value, {
        crossOrigin: 'anonymous',
      });
      toast.dismiss();
      setImageLoading(false);

      img.scaleToWidth(workspace?.width || 0);
      img.scaleToHeight(workspace?.height || 0);
      img.id = nanoid();
      addToCanvas(img);
      toast.dismiss();
      toast.success('添加成功');
    },
    // 删除
    delete: () => {
      canvas?.getActiveObjects().forEach((item) => canvas.remove(item));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    // 获取字体大小
    getActiveFontSize: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('fontSize') || FONT_SIZE;
      return value;
    },
    // 改变字体大小
    changeFontSize: (value: number) => {
      if (value < 0) return;
      setFontSize(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    // 改变字体对齐
    changeFontAlign: (value: fabric.Textbox['textAlign']) => {
      setFontAlign(value);

      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    // 获取字体对齐
    getActiveFontAlign: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('textAlign') || 'left';
      return value;
    },
    // 获取字体斜体
    getActiveFontItalic: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('fontStyle') || 'normal';
      return value;
    },
    // 获取字体下划线
    getActiveFontUnderline: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('underline') || false;
      return value;
    },
    // 改变字体斜体
    changeFontItalic: (value: FontStyle) => {
      setFontItalics(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    // 改变字体下划线
    changeFontUnderline: (value: boolean) => {
      setFontUnderline(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    // 改变字体
    setFontFamily: (value: string) => {
      setFontFamily(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    // 改变字体删除线
    changeFontLineThrough: (value: boolean) => {
      setFontThickness(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    // 改变字体粗细
    changeFontWeight: (value: FontWeightType) => {
      setFontWeight(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    // 获取删除线
    getActiveFontLineThrough: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('linethrough') || false;
      return value;
    },
    // 获取线条宽度
    getActiveStrokeWeight: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('fontWeight') || FONT_WEIGHT;
      return value;
    },
    // 获取字体
    getActiveFontFamily: () => {
      return canvas?.getActiveObjects()?.[0]?.get('fontFamily') || FONT_FAMILY;
    },
    // 添加文本
    addText: (text, options) => {
      const id = nanoid();
      const option = {
        ...TEXTBOX_OPTION,
        ...options,
        id,
      };
      const textObj = new fabric.Textbox(text, option);
      // addObjects({ ...option, type: "Textbox", text }, "add");
      addToCanvas(textObj);
      canvas.setActiveObject(textObj);
      canvas.renderAll();
    },
    // 透明度
    changeOpacty: (opacity: number) => {
      setOpacity(opacity);
      canvas.getActiveObjects().forEach((item) => {
        item.set({
          opacity,
        });
      });
      canvas.renderAll();
    },
    // 获取透明度
    getOpacty: () => {
      const selected = selectedObject?.[0];
      if (!selected) {
        return OPACITY;
      }
      return selected?.get('opacity') || OPACITY;
    },
    // 向前
    bringForward: () => {
      canvas.getActiveObjects().forEach((item) => canvas.bringObjectForward(item));
      const workspace = getWorkspace(canvas);
      if (workspace) canvas.sendObjectBackwards(workspace);
      canvas.renderAll();
    },
    // 向后
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((item) => canvas.sendObjectBackwards(item));
      const workspace = getWorkspace(canvas);
      if (workspace) canvas.sendObjectBackwards(workspace);

      canvas.renderAll();
    },
    // 清除滤镜
    cleanFilter: () => {
      setImageFilter([]);
      canvas.getActiveObjects().forEach((item) => {
        if (item.type === 'image') {
          (item as fabric.FabricImage).filtersArray = [];
          (item as fabric.FabricImage).filters = [];
          (item as fabric.FabricImage).applyFilters();
        }
      });
      canvas.renderAll();
    },
    // 设置线条虚线
    changeStokeDashArray: (type) => {
      setStrokeDashArray(type);
      canvas.getActiveObjects().forEach((obj) => {
        obj.set('strokeDashArray', type);
      });
      canvas.renderAll();
    },
    // 获取线条虚线
    getActiveStokeDashArray: () => {
      const selectedObj = selectedObject?.[0];
      if (!selectedObj) {
        return STROKE_DASH_ARRAY;
      }
      return selectedObj.get('strokeDashArray') || STROKE_DASH_ARRAY;
    },
    // 获取线条宽度
    getActiveStrokeWidth: () => {
      const selectedObj = selectedObject?.[0];
      if (!selectedObj) {
        return STROKE_WIDTH;
      }
      return selectedObj.get('strokeWidth') || STROKE_WIDTH;
    },
    // 获取线条颜色
    getActiveStokeColor: () => {
      const selectedObj = selectedObject?.[0];
      if (!selectedObj) {
        return fillColor;
      }
      return selectedObj.get('stroke') || strokeColor;
    },
    //颜色
    setFillColor: (color: string) => {
      setFillColor(color);
      canvas.getActiveObjects()?.forEach((obj) => {
        obj.set({ fill: color });
      });
      canvas.renderAll();
    },
    // 线条宽度
    setStrokeWidth: (width: number) => {
      setStrokeWidth(width);
      canvas.getActiveObjects()?.forEach((obj) => {
        obj.set({ strokeWidth: width });
      });
      canvas.renderAll();
    },
    //
    setStrokeColor: (color: string) => {
      setStrokeColor(color);
      canvas.getActiveObjects()?.forEach((obj) => {
        //如果是文本
        if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
          obj.set({ fill: color });
          return;
        }
        obj.set({ stroke: color });
      });
      canvas.renderAll();
    },
    addObject: (value: AddObject) => {
      const id = nanoid();
      const addOptions = {
        // 基本选项
        ...value.option,
        // 其他选项
        ...value.otherOption,
        // 之前设置的属性
        fill: fillColor,
        FarbicType: value.addType,
        stroke: strokeColor,
        id,
      };
      let objs: fabric.FabricObject | null = null;
      switch (value.addType) {
        case 'Circle':
          objs = new fabric.Circle(addOptions);
          break;
        case 'Rect':
          objs = new fabric.Rect(addOptions);
          break;
        case 'Triangle':
          objs = new fabric.Triangle(addOptions);
          break;
        case 'Polygon':
          objs = new fabric.Polygon(value.points, addOptions);
          break;
        case 'Path':
          objs = new fabric.Path(value.path as fabric.TSimplePathData, addOptions);
          break;
      }
      if (!objs) return;
      center(objs, canvas);
      // addObjects(
      //   {
      //     ...addOptions,
      //     type: value.addType,
      //     points: value.points,
      //     path: value.path,
      //   },
      //   "add"
      // );
      yMaps?.set(objs.id, JSON.stringify({ ...objs, changeType: 'add', changeClientId: userId }));
      canvas.add(objs);
      canvas.setActiveObject(objs);
    },
  };
};
