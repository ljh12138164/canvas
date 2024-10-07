import * as Fabric from "fabric";
import * as material from "material-colors";
//颜色预设
export const colors = [
  material.red[500],
  material.pink[500],
  material.purple[500],
  material.deepPurple[500],
  material.indigo[500],
  material.blue[500],
  material.lightBlue[500],
  material.cyan[500],
  material.teal[500],
  material.green[500],
  material.lightGreen[500],
  material.lime[500],
  material.yellow[500],
  material.amber[500],
  material.orange[500],
  material.deepOrange[500],
  material.brown[500],
  material.blueGrey[500],
  "transparent",
  //没有的
  material.grey[500],
  material.black,
  material.white,
];
export enum Tool {
  Layout,
  Image,
  Pencil,
  Presentation,
  Settings,
  Shapes,
  Sparkles,
  Type,
  //
  Select,
  Draw,
  Fill,
  StrokeColor,
  StrokeWidth,
  Font,
  Opacity,
  Filter,
  RemoveBg,
}
export interface Edit {
  selectedObject: Fabric.Object[] | null;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  canvas: Fabric.Canvas;
  opacity: number;
  strokeDashArray: number[];
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  addText: (text: string, option?: Fabric.Textbox | {}) => void;
  getOpacty: () => number;
  changeOpacty: (opacity: number) => void;
  bringForward: () => void;
  sendBackwards: () => void;
  changeStokeDashArray: (value: number[]) => void;
  getActiveStrokeWidth: () => number;
  getActiveStokeColor: () => string;
  getActiveStokeDashArray: () => number[];
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setStrokeColor: (color: string) => void;
  addCircle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addRotateTriangle: () => void;
  addSoftRectangle: () => void;
  addDiamod: () => void;
}
export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const DIAMOD_WIDTH = 300;
export const DIAMOD_HEGHT = 300;
export const STROKE_WIDTH = 0;
export const STROKE_DASH_ARRAY = [];
export const OPACITY = 0;
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;

export const CRICLE_OPTION = {
  radius: 100,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTION = {
  width: 200,
  height: 200,
  angle: 0,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};
export const TRIANGLE_OPTION = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 200,
  height: 200,
};
export const DIAMOD_OPTION = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 200,
  height: 200,
};
export const TEXTBOX_OPTION = {
  // type: "textbox",
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};
