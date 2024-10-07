import { isText } from "@/lib/utils";
import {
  CRICLE_OPTION,
  DIAMOD_HEGHT,
  DIAMOD_OPTION,
  DIAMOD_WIDTH,
  Edit,
  OPACITY,
  RECTANGLE_OPTION,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXTBOX_OPTION,
  TRIANGLE_OPTION,
} from "@/types/Edit";
import * as fabric from "fabric";
interface buildEditorProps {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  selectedObject: fabric.Object[] | null;
  opacity: number;
  fontFamily: string;
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
  return {
    strokeColor,
    strokeWidth,
    fillColor,
    canvas,
    selectedObject,
    strokeDashArray,
    opacity,
    fontFamily,
    setFontFamily: (fontFamily) => {
      setFontFamily(fontFamily);
      canvas?.getActiveObjects()?.forEach((item) => {
        if (isText(item)) {
          item.set({ fontFamily });
        }
      });
      canvas.renderAll();
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
        opacity,
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
        opacity,
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
        opacity,
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
        opacity,
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
        opacity,
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
          opacity,
        }
      );
      center(diamod);
      canvas.add(diamod);
      canvas.setActiveObject(diamod);
    },
  };
};
