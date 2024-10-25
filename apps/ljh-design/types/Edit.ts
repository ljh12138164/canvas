import * as material from "material-colors";
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
}
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
