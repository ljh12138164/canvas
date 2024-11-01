import * as material from "material-colors";
import * as fabric from "fabric";
export interface InitFabicObject extends fabric.Object {
  name: string;
}

export const Font: {
  name: string;
  fontSize: string;
  title: string;
  fontWeight: string;
}[] = [
  {
    name: "h1",
    fontSize: "32px",
    fontWeight: "bold",
    title: "添加一级标题",
  },
  {
    name: "h2",
    fontWeight: "bold",
    fontSize: "24px",
    title: "添加二级标题",
  },
  {
    name: "h3",
    fontWeight: "bold",
    fontSize: "18px",
    title: "添加三级标题",
  },
  {
    name: "h4",
    fontSize: "16px",
    fontWeight: "bold",
    title: "添加四级标题",
  },
  {
    name: "h5",
    fontSize: "13.8px",
    fontWeight: "bold",
    title: "添加五级标题",
  },
  {
    name: "h6",
    fontSize: "12px",
    fontWeight: "bold",
    title: "添加六级标题",
  },
  { name: "p", fontSize: "16px", fontWeight: "normal", title: "添加段落" },
];

//颜色预设
export const JSON_KEY = [
  "name",
  "gradientAngle",
  "selectable",
  "hasControls",
  "linkData",
  "editable",
  "extensionType",
  "extension",
];
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
  Type,
  //
  Select,
  Draw,
  Fill,
  StrokeColor,
  StrokeWidth,
  Font,
  FontFamily,
  FontStyle,
  FontThought,
  FontUnderline,
  FontItalic,
  Opacity,
  Filter,
  RemoveBg,
  Delete,
  Copy,
  zoomResize,
  zoomIn,
  zoomOut,
  FilterSetting,
}
export type FontWeightType = "normal" | "bold";

//返回
export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const DIAMOD_WIDTH = 300;
export const DIAMOD_HEGHT = 300;
export const STROKE_WIDTH = 1;
export const STROKE_DASH_ARRAY = [];
export const OPACITY = 0;
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;
export const FONT_WEIGHT = "normal";
export const FONT_THOUGHT = false;
export const FONT_UNDERLINE = false;
export const FONT_ITALICS = "normal";
export const FONT_ALIGN = "left";
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1100;
export const CANVAS_COLOR = "#ffffff";

export const IMAGE_BLUSK =
  "https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/";

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
export type FontStyle = "normal" | "italic";
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
export const fonts = [
  "Arial",
  "Arial Black",
  "Verdana",
  "Hevetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Palatino",
  "Bookman",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Geneva",
  "Lucida Grande",
];
export type Filter =
  | "none"
  | "polaroid"
  | "sepia"
  | "kodachrome"
  | "contrast"
  | "brightness"
  | "brownie"
  | "vintage"
  | "grayscale"
  | "invert"
  | "technicolor"
  | "pixelate"
  | "blur"
  | "sharpen"
  | "emboss"
  | "removecolor"
  | "blackwhite"
  | "vibrance"
  | "blendcolor"
  | "huerotation"
  | "resize"
  | "saturation"
  | "gamma";
export const filters: Filter[] = [
  "none",
  "polaroid",
  "sepia",
  "kodachrome",
  "contrast",
  "brightness",
  "brownie",
  "vintage",
  "grayscale",
  "invert",
  "technicolor",
  "pixelate",
  "blur",
  "sharpen",
  "emboss",
  "removecolor",
  "blackwhite",
  "vibrance",
  "blendcolor",
  "huerotation",
  "resize",
  "saturation",
  "gamma",
];

export interface buildEditorProps {
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
  canvasWidth: number;
  canvasHeight: number;
  canvasColor: string;
  canvasHistory: fabric.FabricObject[];
  pasty: () => void;
  save: (skip?: boolean) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  undo: () => void;
  redo: () => void;
  setHitoryIndex: (index: number) => void;
  setCanvasHeight: (canvasHeight: number) => void;
  setCanvasColor: (canvasColor: string) => void;
  setCanvasWidth: (canvasWidth: number) => void;
  authZoom: () => Promise<void>;
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
export interface Edit {
  selectedObject: fabric.Object[] | null;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  canvas: fabric.Canvas;
  opacity: number;
  strokeDashArray: number[];
  fontFamily: string;
  fontWeight: FontWeightType;
  fontThought: boolean;
  fontUnderline: boolean;
  fontItalics: FontStyle;
  fontAlign: fabric.Textbox["textAlign"];
  fontSize: number;
  imageLoading: boolean;
  imageFilter: string;
  drewColor: string;
  drawWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasColor: string;
  canvasHistory: fabric.FabricObject[];
  cleanFilter: () => void;
  deleteImageFilter: (filter: string) => void;
  savePng: () => void;
  saveSvg: () => void;
  savejpg: () => void;
  saveJson: () => void;
  loadFromJson: (json: string) => void;
  pasty: () => void;
  saveAll: (skip?: boolean) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  undo: () => void;
  redo: () => void;
  setHitoryIndex: (index: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  authZoom: () => Promise<void>;
  setCanvasColor: (color: string) => void;
  getWorkspace: () => InitFabicObject;
  changeSize: (size: { width: number; height: number }) => Promise<void>;
  changeBackground: (color: string) => void;
  setDrewWidths: (width: number) => void;
  copy: () => void;
  setDrewColors: (color: string) => void;
  disableDraw: () => void;
  enableDraw: () => void;
  getActiveFilter: () => string;
  changeImageFilter: (filter: string) => void;
  addImage: (url: string) => void;
  delete: () => void;
  addText: (text: string, option?: fabric.Textbox | object) => void;
  bringForward: () => void;
  getActiveFontLineThrough: () => boolean;
  getActiveFontUnderline: () => boolean;
  getActiveFontSize: () => number;
  getActiveFontItalic: () => FontStyle;
  getActiveFontAlign: () => fabric.Textbox["textAlign"];
  changeFontAlign: (value: fabric.Textbox["textAlign"]) => void;
  changeFontLineThrough: (value: boolean) => void;
  changeFontUnderline: (value: boolean) => void;
  changeFontItalic: (value: FontStyle) => void;
  changeOpacty: (opacity: number) => void;
  changeStokeDashArray: (value: number[]) => void;
  changeFontWeight: (weight: FontWeightType) => void;
  changeFontSize: (size: number) => void;
  sendBackwards: () => void;
  getOpacty: () => number;
  getActiveFontFamily: () => string;
  getActiveStrokeWidth: () => number;
  getActiveStrokeWeight: () => number | string;
  getActiveStokeColor: () => string;
  getActiveStokeDashArray: () => number[];
  setFontFamily: (fontFamily: string) => void;
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
export const ToolItem = {
  [Tool.Fill]: "填充颜色",
  [Tool.StrokeColor]: "描边颜色",
  [Tool.StrokeWidth]: "边框宽度",
  [Tool.Opacity]: "透明度",
  [Tool.FontFamily]: "字体类型",
  [Tool.Filter]: "滤镜",
  [Tool.Settings]: "设置",
  [Tool.Draw]: "画笔",
  [Tool.FilterSetting]: "滤镜设置",
  "": "",
};

export const FilterItem = {
  none: "无",
  polaroid: "偏振",
  sepia: "棕褐色",
  kodachrome: "彩色胶片",
  contrast: "对比度",
  brightness: "亮度",
  brownie: "棕褐色",
  vintage: "复古",
  grayscale: "灰度",
  invert: "反色",
  technicolor: "科技",
  pixelate: "像素化",
  blur: "模糊",
  sharpen: "锐化",
  emboss: "滤波",
  removecolor: "去色",
  blackwhite: "黑白",
  vibrance: "饱和度",
  blendcolor: "混合颜色",
  huerotation: "色调旋转",
  resize: "调整大小",
  saturation: "饱和度",
  gamma: "伽马",
};
