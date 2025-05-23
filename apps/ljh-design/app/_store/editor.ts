import { center } from '@/app/_lib/editor/editor';
import {
  type Effect,
  createFilter,
  getWorkspace,
  importJsonToFabricObject,
  isText,
} from '@/app/_lib/editor/editor';
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
// import { loadSVGFromString } from 'fabric';
import html2canvas from 'html2canvas';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import { convertImagesToPDF, downloadImage, importPDF } from '../_lib/utils';
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
    saveType: undefined;
    groupArr?: fabric.FabricObject[];
  }
  interface FabricObjectProps {
    id?: string;
    type?: string;
  }
  interface GroupProps {
    saveType?: string;
    groupArr: fabric.FabricObject[];
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
  // yMaps,
  // userId,
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
  // 清除画布
  const clear = () => {
    canvas.getObjects().forEach((item) => {
      if (item.name !== 'board') canvas.remove(item);
    });
    canvas.discardActiveObject();
    canvas.renderAll();
    save();
  };
  //加载json
  const loadFromJson = async (json: any, fn?: () => void) => {
    if (typeof json === 'string') await canvas.loadFromJSON(JSON.parse(json));
    else await canvas.loadFromJSON(json);
    authZoom();
    fn?.();
  };
  //添加到画布
  const addToCanvas = (object: fabric.FabricObject) => {
    center(object, canvas);
    canvas.add(object);
    canvas.setActiveObject(object);
  };
  // 修复图片大小
  const fixImageSize = (imageObj: fabric.FabricImage) => {
    const workspace = getWorkspace(canvas);
    imageObj.scaleToWidth(workspace?.width || 0);
    imageObj.scaleToHeight(workspace?.height || 0);
  };
  // 加载svg
  const loadFromSvg = async (svg: string, fn?: () => void) => {
    const farbirArr: fabric.FabricObject[] = [];
    // canvas.loadSVGFromString(svg);
    await fabric.loadSVGFromString(svg, (_, options) => {
      if (options.name !== 'board') farbirArr.push(options);
    });
    // const group = new fabric.Group(farbirArr);
    clear();
    farbirArr.forEach((item) => {
      canvas.add(item);
    });
    canvas.setActiveObject(farbirArr[0]);
    canvas.renderAll();
    // authZoom();
    fn?.();
  };
  // 加载pdf
  // const loadFromPdf = async (pdf: string, fn?: () => void) => {
  //   const farbirArr: fabric.FabricObject[] = [];
  //   canvas.loadFromJSON(pdf);
  //   authZoom();
  //   fn?.();
  // };
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
    loadFromSvg,
    // 设置历史索引
    setHitoryIndex,
    // 设置背景颜色
    setCanvasColor,
    // 响应式
    authZoom,
    // 清空画布
    clear,
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
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('filters') || [];
        return value.map((item: FilterArrayEffect) => item.name);
      }
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
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('filters') || [];
        return value.findIndex((item: FilterArrayEffect) => item.name === filter);
      }
      const value = canvas?.getActiveObjects()?.[0];
      if (value instanceof fabric.FabricImage) {
        return value.filtersArray.findIndex((item) => item.name === filter);
      }
      return -1;
    },
    // 获取滤镜效果
    getActiveFilterEffect: (filter: string) => {
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('filters') || [];
        return value.find((item: FilterArrayEffect) => item.name === filter)?.effect || null;
      }
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
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('fontSize') ||
          FONT_SIZE;
        return value;
      }
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
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('textAlign') ||
          'left';
        return value;
      }
      const value = canvas?.getActiveObjects()?.[0]?.get('textAlign') || 'left';
      return value;
    },
    // 获取字体斜体
    getActiveFontItalic: () => {
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('fontStyle') ||
          'normal';
        return value;
      }
      const value = canvas?.getActiveObjects()?.[0]?.get('fontStyle') || 'normal';
      return value;
    },
    // 获取字体下划线
    getActiveFontUnderline: () => {
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('underline') ||
          false;
        return value;
      }
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
    setFontFamily: (value: string, type: 'chinese' | 'english' = 'english') => {
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
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('linethrough') ||
          false;
        return value;
      }
      const value = canvas?.getActiveObjects()?.[0]?.get('linethrough') || false;
      return value;
    },
    // 获取线条宽度
    getActiveStrokeWeight: () => {
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('strokeWidth') ||
          STROKE_WIDTH;
        return value;
      }
      const value = canvas?.getActiveObjects()?.[0]?.get('fontWeight') || FONT_WEIGHT;
      return value;
    },
    // 获取字体
    getActiveFontFamily: () => {
      if (canvas?.getActiveObjects()?.[0]?.type === 'group') {
        const value =
          (canvas?.getActiveObjects()?.[0] as fabric.Group).getObjects()[0]?.get('fontFamily') ||
          FONT_FAMILY;
        return value;
      }
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
    // 添加表情
    addEmoji: (emoji: string) => {
      const textObj = new fabric.Textbox(emoji, {
        ...TEXTBOX_OPTION,
        fontSize: 80,
        id: nanoid(),
      });
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
    // 图层向前
    bringForward: () => {
      canvas.getActiveObjects().forEach((item) => canvas.bringObjectForward(item));
      const workspace = getWorkspace(canvas);
      // 设置到最前面
      if (workspace) canvas.sendObjectBackwards(workspace);
      canvas.renderAll();
    },
    // 图层向后
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((item) => canvas.sendObjectBackwards(item));
      const workspace = getWorkspace(canvas);
      // 设置到最前面
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
        if (obj.type === 'group') {
          (obj as fabric.Group).getObjects().forEach((item) => {
            item.set('strokeDashArray', type);
          });
        } else {
          obj.set('strokeDashArray', type);
        }
      });
      canvas.renderAll();
    },
    // 获取线条虚线
    getActiveStokeDashArray: () => {
      const selectedObj = selectedObject?.[0];
      if (!selectedObj) {
        return STROKE_DASH_ARRAY;
      }
      if (selectedObj?.type === 'group') {
        const value =
          (selectedObj as fabric.Group).getObjects()[0]?.get('strokeDashArray') ||
          STROKE_DASH_ARRAY;
        return value;
      }
      return selectedObj.get('strokeDashArray') || STROKE_DASH_ARRAY;
    },
    // 获取线条宽度
    getActiveStrokeWidth: () => {
      const selectedObj = selectedObject?.[0];
      if (selectedObj?.type === 'group') {
        const value =
          (selectedObj as fabric.Group).getObjects()[0]?.get('strokeWidth') || STROKE_WIDTH;
        return value;
      }
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
      if (selectedObj?.type === 'group') {
        const value = (selectedObj as fabric.Group).getObjects()[0]?.get('stroke') || strokeColor;
        return value;
      }
      return selectedObj.get('stroke') || strokeColor;
    },
    // 颜色
    setFillColor: (color: string) => {
      setFillColor(color);
      canvas.getActiveObjects()?.forEach((obj) => {
        if (obj.type === 'group') {
          (obj as fabric.Group).getObjects().forEach((item) => {
            item.set({ fill: color });
          });
        } else {
          obj.set({ fill: color });
        }
      });
      canvas.renderAll();
    },
    // 线条宽度
    setStrokeWidth: (width: number) => {
      setStrokeWidth(width);
      canvas.getActiveObjects()?.forEach((obj) => {
        if (obj.type === 'group') {
          (obj as fabric.Group).getObjects().forEach((item) => {
            item.set({ strokeWidth: width });
          });
        } else {
          obj.set({ strokeWidth: width });
        }
      });
      canvas.renderAll();
    },
    // 线条颜色
    setStrokeColor: (color: string) => {
      setStrokeColor(color);
      canvas.getActiveObjects()?.forEach((obj) => {
        if (obj.type === 'group') {
          (obj as fabric.Group).getObjects().forEach((item) => {
            //如果是文本
            if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
              obj.set({ fill: color });
              return;
            }
            obj.set({ stroke: color });
          });
        } else {
          //如果是文本
          if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
            obj.set({ fill: color });
            return;
          }
          obj.set({ stroke: color });
        }
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
      // yMaps?.set(objs.id, JSON.stringify({ ...objs, changeType: 'add', changeClientId: userId }));
      canvas.add(objs);
      canvas.setActiveObject(objs);
    },
    // 设置为素材
    setMaterial: (material: fabric.FabricObject[]) => {
      material.forEach((item) => {
        canvas.remove(item);
      });
      const group = new fabric.Group(material, {
        // 保存时设置为id
        id: nanoid(),
        saveType: 'material',
        groupArr: material,
      });
      // 添加素材组
      canvas.add(group);
      // 设置为活动对象
      canvas.setActiveObject(group);
      canvas.renderAll();
    },
    // 加载素材
    addMaterial: async (material) => {
      if (!canvas) return;
      // 解析 JSON
      const group = await fabric.util.enlivenObjects([material]);

      // 将素材添加到画布中心
      canvas.add(group[0] as fabric.Group);
      canvas.setActiveObject(group[0] as fabric.Group);
      center(group[0] as fabric.Group, canvas);
      // canvas._centerObject(group[0] as fabric.Group, canvas.getCenterPoint());
      // canvas.renderAll();

      // 保存历史记录
      save();
    },
    // 添加图表
    addGrap: (dom) => {
      return new Promise((res, rej) => {
        try {
          if (!dom) return;
          // 使用html2canvas将dom转换为图片
          html2canvas(dom).then(async (HTMLTOCANVAS) => {
            const dataURL = HTMLTOCANVAS.toDataURL('image/png');
            // 在 Fabric.js 中加载图片
            const image = await fabric.FabricImage.fromURL(dataURL, {
              crossOrigin: 'anonymous', // 添加跨域属性
            });
            canvas.add(image);
            canvas.setActiveObject(image);
            const board = getWorkspace(canvas);
            if (!board) return;
            // 将图片添加到画布中心
            center(image, canvas);
            canvas.renderAll();
            save();
            res(true);
          });
        } catch (err) {
          rej(false);
        }
      });
    },
    // 导入pdf
    importPDFFILE: async (File) => {
      const images = await importPDF(File);
      // 遍历所有图片
      for (const image of images) {
        // 创建fabric图片对象
        const fabricImage = await fabric.FabricImage.fromURL(image);
        // 设置图片id
        fabricImage.id = nanoid();
        // 添加到画布
        canvas.add(fabricImage);
        // 设置为当前选中对象
        canvas.setActiveObject(fabricImage);
        // 修复图片大小
        fixImageSize(fabricImage);
      }
      // 重新渲染画布
      canvas.renderAll();
      // 保存历史记录
      toast.success(`导入成功${images.length}张图片`);
      save();
    },
    // 保存pdf
    savePdf: async () => {
      const option = genertateSaveOption();
      // 设置画布缩放
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = canvas.toDataURL({ ...option, format: 'png' });
      const workspace = getWorkspace(canvas);
      const pdfDataUri = await convertImagesToPDF(dataUrl, workspace.width, workspace.height);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfDataUri;
      downloadLink.download = '文档.pdf';
      // 确保在用户交互中触发点击
      downloadLink.click();
      authZoom();
    },
    addAiImage: async (dataURL) => {
      const image = await fabric.FabricImage.fromURL(dataURL, {
        crossOrigin: 'anonymous', // 添加跨域属性
      });
      image.set({
        // globalCompositeOperation: 'destination-over', // 保留混合模式设置
      });
      // 将图片添加到画布中心
      center(image, canvas);
      canvas.add(image);
      canvas.setActiveObject(image);
      const board = getWorkspace(canvas);
      if (!board) return;
      canvas.renderAll();
      save();
    },
    // 添加对象到画布
    addObjectsToCanvas: (objects) => {
      try {
        // 将对象转换为fabric.js的对象
        const fabricObjects = importJsonToFabricObject(objects);
        if (!fabricObjects || fabricObjects.length === 0) {
          toast.error('无法解析对象数据');
          return;
        }
        if (Array.isArray(fabricObjects)) {
          // editor.canvas?.add(...fabricObjects);
          fabricObjects.forEach((item) => {
            center(item, canvas);
            canvas.add(item);
          });
        } else {
          // editor.canvas?.add(fabricObjects);
          center(fabricObjects, canvas);
          canvas.add(fabricObjects);
        }
        toast.success('已将对象添加到画布');
      } catch (error) {
        console.error('添加到画布失败:', error);
        toast.error('添加到画布时出错');
      }
    },
    save,
  };
};
