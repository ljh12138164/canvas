import { createFilter, isText } from "@/lib/utils";
import {
  CRICLE_OPTION,
  DIAMOD_HEGHT,
  DIAMOD_OPTION,
  DIAMOD_WIDTH,
  Edit,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  FontStyle,
  OPACITY,
  RECTANGLE_OPTION,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXTBOX_OPTION,
  TRIANGLE_OPTION,
} from "@/types/Edit";
import * as fabric from "fabric";
import toast from "react-hot-toast";
export type FontWeightType = "normal" | "bold";
interface buildEditorProps {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  selectedObject: fabric.Object[] | null;
  opacity: number;
  fontFamily: string;
  fontWeight: FontWeightType;
  fontThought: boolean;
  fontItalics: FontStyle;
  fontUnderline: boolean;
  fontAlign: fabric.Textbox["textAlign"];
  fontSize: number;
  imageLoading: boolean;
  imageFilter: string;
  drewColor: string;
  drawWidth: number;
  setDrawWidth: (drawWidth: number) => void;
  setDrewColor: (drewColor: string) => void;
  copy: () => void;
  setImageFilter: (imageFilter: string) => void;
  setImageLoading: (imageLoading: boolean) => void;
  setFontSize: (fontSize: number) => void;
  setFontAlign: (fontAlign: fabric.Textbox["textAlign"]) => void;
  setFontUnderline: (fontUnderline: boolean) => void;
  setFontItalics: (fontItalics: FontStyle) => void;
  setFontThickness: (fontThickness: boolean) => void;
  setFontWeight: (fontWeight: FontWeightType) => void;
  setFontFamily: (fontFamily: string) => void;
  setOpacity: (opacity: number) => void;
  setStrokeDashArray: (type: number[]) => void;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}
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
  setDrewColor,
  drawWidth,
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
  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

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
    setDrewColor: (color: string) => {
      if (canvas.freeDrawingBrush?.color) {
        setDrewColor(color);
        canvas.freeDrawingBrush.color = color;
      }
    },
    setDrewWidth: (width: number) => {
      if (canvas.freeDrawingBrush?.color) {
        setDrawWidth(width);
        canvas.freeDrawingBrush.width = width;
      }
    },

    disableDraw: () => {
      canvas.isDrawingMode = false;
    },
    getActiveFilter: () => {
      let value =
        canvas?.getActiveObjects()?.[0]?.get("filters")?.[0]?.type || "none";
      if (value === "Convolute") {
        if (
          canvas?.getActiveObjects()?.[0]?.get("filters")?.[0].matrix[0] === 0
        )
          value = "sharpen";
        else value = "emboss";
      }

      setImageFilter(value);

      return value || "none";
    },
    changeImageFilter: (filter: string) => {
      setImageFilter(filter);
      canvas.getActiveObjects().forEach((item: fabric.Object) => {
        if (item.type === "image") {
          const imageObj = item as fabric.FabricImage;
          const effect = createFilter(filter);
          imageObj.filters = effect ? [effect] : [];
          imageObj.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: async (value: string) => {
      toast.loading("添加中...");
      setImageLoading(true);
      const workspace = getWorkspace();
      const img = await fabric.FabricImage.fromURL(value, {
        crossOrigin: "anonymous",
      });
      toast.dismiss();
      setImageLoading(false);

      img.scaleToWidth(workspace?.width || 0);
      img.scaleToHeight(workspace?.height || 0);
      addToCanvas(img);
      toast.success("添加成功");
    },
    delete: () => {
      canvas?.getActiveObjects().forEach((item) => canvas.remove(item));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const value =
        canvas?.getActiveObjects()?.[0]?.get("fontSize") || FONT_SIZE;
      setFontAlign(value);
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
    changeFontAlign: (value: fabric.Textbox["textAlign"]) => {
      setFontAlign(value);

      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontAlign: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get("textAlign") || "left";
      setFontAlign(value);
      return value;
    },
    //
    getActiveFontItalic: () => {
      const value =
        canvas?.getActiveObjects()?.[0]?.get("fontStyle") || "normal";
      setFontItalics(value);
      return value;
    },
    getActiveFontUnderline: () => {
      const value = canvas?.getActiveObjects()?.[0]?.get("underline") || false;
      setFontUnderline(value);
      return value;
    },
    changeFontItalic: (value: FontStyle) => {
      setFontItalics(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    changeFontUnderline: (value: boolean) => {
      setFontUnderline(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    //
    setFontFamily: (value: string) => {
      setFontFamily(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    //斜体
    changeFontLineThrough: (value: boolean) => {
      setFontThickness(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    changeFontWeight: (value: FontWeightType) => {
      setFontWeight(value);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLineThrough: () => {
      const value =
        canvas?.getActiveObjects()?.[0]?.get("linethrough") || false;
      setFontThickness(value);
      return value;
    },
    getActiveStrokeWeight: () => {
      const value =
        canvas?.getActiveObjects()?.[0]?.get("fontWeight") || FONT_WEIGHT;
      setFontWeight(value as FontWeightType);
      return value;
    },
    getActiveFontFamily: () => {
      return canvas?.getActiveObjects()?.[0]?.get("fontFamily") || FONT_FAMILY;
    },
    addText: (text, options) => {
      const textObj = new fabric.Textbox(text, {
        ...TEXTBOX_OPTION,
        ...options,
        fill: fillColor,
      });
      canvas.add(textObj);
      center(textObj);
      canvas.add(textObj);
      canvas.setActiveObject(textObj);
    },
    changeOpacty: (opacity: number) => {
      setOpacity(opacity);
      canvas.getActiveObjects().forEach((item) => {
        item.set({
          opacity,
        });
      });
      canvas.renderAll();
    },
    getOpacty: () => {
      const selected = selectedObject?.[0];
      if (!selected) {
        return OPACITY;
      }
      return selected?.get("opacity") || OPACITY;
    },
    //前后
    bringForward: () => {
      canvas
        .getActiveObjects()
        .forEach((item) => canvas.bringObjectForward(item));
      const workspace = getWorkspace();
      if (workspace) canvas.sendObjectBackwards(workspace);
      canvas.renderAll();
    },
    sendBackwards: () => {
      canvas
        .getActiveObjects()
        .forEach((item) => canvas.sendObjectBackwards(item));
      const workspace = getWorkspace();
      if (workspace) canvas.sendObjectBackwards(workspace);

      canvas.renderAll();
    },

    changeStokeDashArray: (type) => {
      setStrokeDashArray(type);
      canvas.getActiveObjects().forEach((obj) => {
        obj.set("strokeDashArray", type);
      });
      canvas.renderAll();
    },
    getActiveStokeDashArray: () => {
      const selectedObj = selectedObject?.[0];
      if (!selectedObj) {
        return STROKE_DASH_ARRAY;
      }
      return selectedObj.get("strokeDashArray") || STROKE_DASH_ARRAY;
    },
    getActiveStrokeWidth: () => {
      const selectedObj = selectedObject?.[0];
      if (!selectedObj) {
        return STROKE_WIDTH;
      }
      return selectedObj.get("strokeWidth") || STROKE_WIDTH;
    },
    getActiveStokeColor: () => {
      const selectedObj = selectedObject?.[0];
      if (!selectedObj) {
        return fillColor;
      }
      return selectedObj.get("stroke") || strokeColor;
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
      canvas.renderAll();
    },
    //园
    addCircle: () => {
      const circle = new fabric.Circle({
        ...CRICLE_OPTION,
        fill: fillColor,
        stroke: strokeColor,
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
        fill: fillColor,
        stroke: strokeColor,
      });
      center(rect);
      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
    //圆角矩形
    addSoftRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTION,
        fill: fillColor,
        stroke: strokeColor,
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
        fill: fillColor,
        stroke: strokeColor,
      });
      center(triangle);
      canvas.add(triangle);
      canvas.setActiveObject(triangle);
    },
    addRotateTriangle: () => {
      const triangle = new fabric.Triangle({
        ...TRIANGLE_OPTION,
        fill: fillColor,
        stroke: strokeColor,
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
          fill: fillColor,
          stroke: strokeColor,
        }
      );
      center(diamod);
      canvas.add(diamod);
      canvas.setActiveObject(diamod);
    },
  };
};
