import { center, getWorkspace } from '@/app/_lib/editor/editor';
import {
  createFilter,
  downloadImage,
  Effect,
  isText,
  transformToTest,
} from '@/app/_lib/utils';
import {
  AddObject,
  buildEditorProps,
  Edit,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  FontStyle,
  FontWeightType,
  InitFabicObject,
  JSON_KEY,
  NewFabicObject,
  OPACITY,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXTBOX_OPTION,
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
    changeType?: string;
    changeClientId?: string;
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
  websockets,
  user,
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
  const addObject = (options: NewFabicObject, type: 'add' | 'update') => {
    yMaps.set(
      options.id!,
      JSON.stringify({
        ...options,
        changeType: type,
        changeClientId: user.user.id,
      })
    );
  };
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
    const cleanedSvg = dataUrl.replace(
      /&(?!amp;|lt;|gt;|quot;|#39;)/g,
      '&amp;'
    );

    const svgBlob = new Blob([cleanedSvg], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    downloadImage(svgUrl, 'svg');
    URL.revokeObjectURL(svgUrl);
    authZoom();
  };
  //保存png
  const savePng = () => {
    const option = genertateSaveOption();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL({ ...option, format: 'png' });
    downloadImage(dataUrl, 'png');
    authZoom();
  };

  //保存jpg
  const savejpg = () => {
    const option = genertateSaveOption();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL({ ...option, format: 'png' });
    downloadImage(dataUrl, 'jpg');
    authZoom();
  };
  //保存json
  const saveJson = () => {
    const dataUrl = canvas.toObject(JSON_KEY);
    transformToTest(dataUrl);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downloadImage(fileString, 'json');
    authZoom();
  };
  //加载json
  const loadFromJson = async (json: string) => {
    const data = JSON.parse(json);
    await canvas.loadFromJSON(data);
    authZoom();
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
    setHitoryIndex,
    setCanvasColor,
    authZoom,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenterPoint();
      canvas.zoomToPoint(center, zoomRatio > 1 ? 1 : zoomRatio);
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenterPoint();
      //防止过小
      canvas.zoomToPoint(center, zoomRatio < 0.2 ? 0.2 : zoomRatio);
    },
    getWorkspace: () => getWorkspace(canvas) as InitFabicObject,
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
    changeBackground: (color: string) => {
      setCanvasColor(color);
      const workspace = getWorkspace(canvas);
      if (workspace) {
        workspace.fill = color;
      }
      canvas.renderAll();
      save();
    },
    copy,
    enableDraw: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;

      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = strokeColor;
      }
    },
    setDrewColors: (color: string) => {
      if (canvas.freeDrawingBrush?.color) {
        canvas.freeDrawingBrush.color = color;
        setDrewColor(color);
      }
    },
    setDrewWidths: (width: number) => {
      if (canvas.freeDrawingBrush?.color) {
        setDrawWidth(width);
        canvas.freeDrawingBrush.width = width;
      }
    },
    disableDraw: () => {
      canvas.isDrawingMode = false;
    },
    getActiveFilter: () => {
      if (canvas?.getActiveObjects()?.[0]) {
        const value = canvas?.getActiveObjects()?.[0];
        if (value instanceof fabric.FabricImage) {
          return value.filtersArray.length > 0
            ? value.filtersArray.map((item) => item.name)
            : [];
        }
      }
      return [];
    },
    getActiveFilterIndex: (filter: string) => {
      const value = canvas?.getActiveObjects()?.[0];
      if (value instanceof fabric.FabricImage) {
        return value.filtersArray.findIndex((item) => item.name === filter);
      }
      return -1;
    },
    getActiveFilterEffect: (filter: string) => {
      const value = canvas?.getActiveObjects()?.[0];
      if (value instanceof fabric.FabricImage) {
        return (
          value.filtersArray.find((item) => item.name === filter)?.effect ||
          null
        );
      }
      return null;
    },
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
          imageObj.filtersArray = imageObj.filtersArray.filter(
            (item) => item.name !== filter
          );
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
    delete: () => {
      canvas?.getActiveObjects().forEach((item) => canvas.remove(item));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const value =
        canvas?.getActiveObjects()?.[0]?.get('fontSize') || FONT_SIZE;
      return value;
    },
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
    changeFontAlign: (value: fabric.Textbox['textAlign']) => {
      setFontAlign(value);

      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontAlign: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('textAlign') || 'left';
      return value;
    },
    //
    getActiveFontItalic: () => {
      const value =
        canvas?.getActiveObjects()?.[0]?.get('fontStyle') || 'normal';
      return value;
    },
    getActiveFontUnderline: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get('underline') || false;
      return value;
    },
    // 斜体
    changeFontItalic: (value: FontStyle) => {
      setFontItalics(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    // 下划线
    changeFontUnderline: (value: boolean) => {
      setFontUnderline(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    // 字体
    setFontFamily: (value: string) => {
      setFontFamily(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    // 删除线
    changeFontLineThrough: (value: boolean) => {
      setFontThickness(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    // 字体粗细
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
      const value =
        canvas?.getActiveObjects()?.[0]?.get('linethrough') || false;
      return value;
    },
    // 获取线条宽度
    getActiveStrokeWeight: () => {
      const value =
        canvas?.getActiveObjects()?.[0]?.get('fontWeight') || FONT_WEIGHT;
      return value;
    },
    // 获取字体
    getActiveFontFamily: () => {
      return canvas?.getActiveObjects()?.[0]?.get('fontFamily') || FONT_FAMILY;
    },
    // 添加文本
    addText: (text, options) => {
      const textObj = new fabric.Textbox(text, {
        ...TEXTBOX_OPTION,
        ...options,
        fill: fillColor,
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
    // 向前
    bringForward: () => {
      canvas
        .getActiveObjects()
        .forEach((item) => canvas.bringObjectForward(item));
      const workspace = getWorkspace(canvas);
      if (workspace) canvas.sendObjectBackwards(workspace);
      canvas.renderAll();
    },
    // 向后
    sendBackwards: () => {
      canvas
        .getActiveObjects()
        .forEach((item) => canvas.sendObjectBackwards(item));
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
        if (
          obj.type === 'text' ||
          obj.type === 'i-text' ||
          obj.type === 'textbox'
        ) {
          obj.set({ fill: color });
          return;
        }
        obj.set({ stroke: color });
      });
      canvas.renderAll();
    },
    //园
    // addCircle: () => {
    //   const id = nanoid();
    //   const addOptions = {
    //     ...CRICLE_OPTION,
    //     fill: fillColor,
    //     stroke: strokeColor,
    //     id,
    //   };
    //   const circle = new fabric.Circle(addOptions);
    //   center(circle, canvas);
    //   addObject({ ...addOptions, type: 'Circle' }, 'add');
    //   canvas.add(circle);
    //   canvas.setActiveObject(circle);
    //   //选中对象
    // },
    // //矩形
    // addRectangle: () => {
    //   const id = nanoid();
    //   const addOptions = {
    //     ...RECTANGLE_OPTION,

    //     fill: fillColor,
    //     stroke: strokeColor,
    //     id,
    //   };
    //   const rect = new fabric.Rect(addOptions);
    //   center(rect, canvas);
    //   addObject({ ...addOptions, type: 'Rect' }, 'add');
    //   canvas.add(rect);
    //   canvas.setActiveObject(rect);
    // },
    // //圆角矩形
    // addSoftRectangle: () => {
    //   const id = nanoid();
    //   const addOptions = {
    //     ...RECTANGLE_OPTION,
    //     fill: fillColor,
    //     stroke: strokeColor,
    //     rx: 10,
    //     ry: 10,
    //     id,
    //   };
    //   const rectangle = new fabric.Rect(addOptions);
    //   center(rectangle, canvas);
    //   addObject({ ...addOptions, type: 'Rect' }, 'add');
    //   canvas.add(rectangle);
    //   canvas.setActiveObject(rectangle);
    // },
    // //三角形
    // addTriangle: () => {
    //   const id = nanoid();
    //   const addOptions = {
    //     ...TRIANGLE_OPTION,
    //     fill: fillColor,
    //     stroke: strokeColor,
    //     id,
    //   };
    //   const triangle = new fabric.Triangle(addOptions);
    //   center(triangle, canvas);
    //   addObject({ ...addOptions, type: 'Triangle' }, 'add');
    //   canvas.add(triangle);
    //   canvas.setActiveObject(triangle);
    // },
    // // 旋转三角形
    // addRotateTriangle: () => {
    //   const id = nanoid();
    //   const addOptions = {
    //     ...TRIANGLE_OPTION,
    //     fill: fillColor,
    //     stroke: strokeColor,
    //     //180反转
    //     angle: 180,
    //     id,
    //   };
    //   const triangle = new fabric.Triangle(addOptions);
    //   center(triangle, canvas);
    //   addObject({ ...addOptions, type: 'Triangle' }, 'add');
    //   canvas.add(triangle);
    //   canvas.setActiveObject(triangle);
    // },
    // addDiamod: () => {
    //   const id = nanoid();
    //   const addOptions = {
    //     ...DIAMOD_OPTION,
    //     fill: fillColor,
    //     stroke: strokeColor,
    //     id,
    //   };
    //   const points = [
    //     {
    //       x: DIAMOD_WIDTH / 2,
    //       y: 0,
    //     },
    //     {
    //       x: DIAMOD_WIDTH,
    //       y: DIAMOD_HEGHT / 2,
    //     },
    //     { x: DIAMOD_WIDTH / 2, y: DIAMOD_HEGHT },
    //     {
    //       x: 0,
    //       y: DIAMOD_WIDTH / 2,
    //     },
    //   ];
    //   const diamod = new fabric.Polygon(points, addOptions);
    //   center(diamod, canvas);
    //   addObject({ ...addOptions, type: 'Polygon', points }, 'add');
    //   canvas.add(diamod);
    //   canvas.setActiveObject(diamod);
    // },
    addObject: (value: AddObject) => {
      const id = nanoid();
      const addOptions = {
        // 基本选项
        ...value.option,
        // 其他选项
        ...value.otherOption,
        // 之前设置的属性
        fill: fillColor,
        stroke: strokeColor,
        id,
      };
      let obj: fabric.FabricObject;
      switch (value.addType) {
        case 'Circle':
          obj = new fabric.Circle(addOptions);
          break;
        case 'Rect':
          obj = new fabric.Rect(addOptions);
          break;
        case 'Triangle':
          obj = new fabric.Triangle(addOptions);
          break;
        case 'Polygon':
          obj = new fabric.Polygon(value.points, addOptions);
          break;
      }
      center(obj, canvas);
      addObject({ ...addOptions, type: value.addType }, 'add');
      canvas.add(obj);
      canvas.setActiveObject(obj);
    },
  };
};
