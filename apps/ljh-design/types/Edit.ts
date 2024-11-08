import * as material from 'material-colors';
import * as fabric from 'fabric';
import { Effect } from '@/lib/utils';
export type TBlendMode =
  | 'multiply'
  | 'add'
  | 'difference'
  | 'screen'
  | 'subtract'
  | 'darken'
  | 'lighten'
  | 'overlay'
  | 'exclusion'
  | 'tint';
export type TResizeType = 'bilinear' | 'hermite' | 'sliceHack' | 'lanczos';
export type TGrayscaleMode = 'average' | 'lightness' | 'luminosity';
export type ResizeOwnProps = {
  resizeType: TResizeType;
  scaleX: number;
  scaleY: number;
  lanczosLobes: number;
};
export interface InitFabicObject extends fabric.Object {
  name: string;
}
export interface ColorFilterProps {
  id: string;
  name: string;
  type: 'color';
  title: string;
  value?: (value: string) => fabric.filters.BaseFilter<string, any>;
}
export interface OptionFilterProps {
  id: string;
  name: string;
  type: 'option';
  title: string;
  options: {
    title: string;
    value: TBlendMode | TResizeType | TGrayscaleMode;
  }[];
  value?: (
    value: TBlendMode | TResizeType | TGrayscaleMode
  ) => fabric.filters.BaseFilter<string, any>;
}
export interface SiderProps {
  id: string;
  type: 'slider';
  index?: number;
  name: string;
  title: string;
  value?: (value: number) => fabric.filters.BaseFilter<string, any>;
  min: number;
  max: number;
  step: number;
}
export interface CheckboxProps {
  id: string;
  name: string;
  title: string;
  type: 'checkbox';
  value?: (value: boolean) => fabric.filters.BaseFilter<string, any>;
}
interface CanFilterChangeType {
  name: string;
  title: string;
  multiply?: (value: any) => fabric.filters.BaseFilter<string, any>;
  change: (SiderProps | CheckboxProps | ColorFilterProps | OptionFilterProps)[];
}
export const canfilterArr = [
  'contrast',
  'brightness',
  'blur',
  'removecolor',
  'blendcolor',
  'pixelate',
  'saturation',
  'resize',
  'huerotation',
  'invert',
  'gamma',
  'vibrance',
  'grayscale',
];
export const CanfilterSetting: CanFilterChangeType[] = [
  // ok
  {
    name: 'contrast',
    title: '对比度',
    change: [
      {
        id: 'contrast',
        name: 'contrast',
        type: 'slider',
        title: '对比度强度',
        value: (value: number) =>
          new fabric.filters.Contrast({ contrast: value }),
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  // ok
  {
    name: 'brightness',
    title: '亮度',
    change: [
      {
        id: 'brightness',
        name: 'brightness',
        type: 'slider',
        title: '亮度强度',
        value: (value: number) =>
          new fabric.filters.Brightness({ brightness: value }),
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  // ok
  {
    name: 'blur',
    title: '模糊',
    change: [
      {
        id: 'blur',
        name: 'blur',
        type: 'slider',
        title: '模糊强度',
        value: (value: number) => new fabric.filters.Blur({ blur: value }),
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    name: 'vibrance',
    title: '色彩',
    change: [
      {
        id: 'vibrance',
        name: 'vibrance',
        type: 'slider',
        title: '色彩强度',
        value: (value: number) =>
          new fabric.filters.Vibrance({ vibrance: value }),
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },
  {
    name: 'removecolor',
    title: '去色',
    multiply: (obj: { useAlpha: boolean; distance: number; color: string }) =>
      new fabric.filters.RemoveColor(obj),
    change: [
      {
        id: 'useAlpha',
        name: 'useAlpha',
        type: 'checkbox',
        title: '使用alpha通道',
      },
      {
        id: 'distance',
        name: 'distance',
        type: 'slider',
        title: '去色范围',
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        id: 'color',
        name: 'color',
        type: 'color',
        title: '去色',
      },
    ],
  },
  {
    name: 'pixelate',
    title: '像素化',
    change: [
      {
        id: 'blocksize',
        name: 'blocksize',
        type: 'slider',
        title: '像素化强度',
        min: 1,
        max: 500,
        step: 1,
        value: (value: number) =>
          new fabric.filters.Pixelate({ blocksize: value }),
      },
    ],
  },
  {
    name: 'blendcolor',
    title: '混合颜色',
    multiply: (obj: { color: string; mode: TBlendMode }) =>
      new fabric.filters.BlendColor(obj),
    change: [
      {
        id: 'color',
        name: 'color',
        type: 'color',
        title: '混合颜色',
        value: (value: string) =>
          new fabric.filters.BlendColor({ color: value }),
      },
      {
        id: 'mode',
        name: 'mode',
        type: 'option',
        title: '混合模式',
        options: [
          { title: '乘法', value: 'multiply' },
          { title: '加法', value: 'add' },
          { title: '差值', value: 'difference' },
          { title: '屏幕', value: 'screen' },
          { title: '减法', value: 'subtract' },
          { title: '加深', value: 'darken' },
          { title: '变亮', value: 'lighten' },
          { title: '覆盖', value: 'overlay' },
          { title: '排除', value: 'exclusion' },
          { title: '色调', value: 'tint' },
        ],
        value: (value) =>
          new fabric.filters.BlendColor({ mode: value as TBlendMode }),
      },
      {
        id: 'alpha',
        name: 'alpha',
        type: 'slider',
        title: 'alpha等级',
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    name: 'saturation',
    title: '饱和度',
    change: [
      {
        id: 'saturation',
        name: 'saturation',
        type: 'slider',
        title: '饱和度强度',
        value: (value: number) =>
          new fabric.filters.Saturation({ saturation: value }),
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    name: 'grayscale',
    title: '灰度',
    change: [
      {
        id: 'mode',
        name: 'mode',
        type: 'option',
        title: '灰度模式',
        options: [
          { title: '平均', value: 'average' },
          { title: '亮度', value: 'lightness' },
          { title: '光度', value: 'luminosity' },
        ],
        value: (value: TBlendMode | TResizeType | TGrayscaleMode) =>
          new fabric.filters.Grayscale({ mode: value as TGrayscaleMode }),
      },
    ],
  },

  {
    name: 'resize',
    title: '调整大小',
    multiply: (obj: ResizeOwnProps) => new fabric.filters.Resize(obj),
    change: [
      {
        id: 'resizeType',
        name: 'resizeType',
        type: 'option',
        title: '调整大小类型',
        options: [
          { title: '双线性', value: 'bilinear' },
          { title: '兰索斯', value: 'lanczos' },
          { title: '插值', value: 'hermite' },
          { title: '切片', value: 'sliceHack' },
        ],
      },
      {
        id: 'scaleX',
        name: 'scaleX',
        type: 'slider',
        title: '调整大小x轴',
        min: 0,
        max: 1,
        step: 0.01,
      },

      {
        id: 'scaleY',
        name: 'scaleY',
        type: 'slider',
        title: '调整大小y轴',
        min: 0,
        max: 1,
        step: 0.01,
      },

      {
        id: 'lanczosLobes',
        name: 'lanczosLobes',
        type: 'slider',
        title: '滤波器',
        min: 1,
        max: 10,
        step: 1,
      },
    ],
  },
  {
    name: 'huerotation',
    title: '色调旋转',
    change: [
      {
        id: 'rotation',
        name: 'rotation',
        type: 'slider',
        title: '色调旋转强度',
        min: 0,
        max: 1,
        step: 0.01,
        value: (value: number) =>
          new fabric.filters.HueRotation({ rotation: value }),
      },
    ],
  },
  {
    name: 'gamma',
    title: '伽马',
    multiply: (obj: { gamma: [number, number, number] }) =>
      new fabric.filters.Gamma(obj),
    change: [
      {
        id: 'gamma',
        name: 'gamma0',
        index: 0,
        type: 'slider',
        title: '伽马强度1',
        min: 0,
        max: 10,
        step: 1,
      },
      {
        id: 'gamma',
        name: 'gamma1',
        index: 1,
        type: 'slider',
        title: '伽马强度2',
        min: 0,
        max: 10,
        step: 1,
      },
      {
        id: 'gamma',
        name: 'gamma2',
        index: 2,
        type: 'slider',
        title: '伽马强度3',
        min: 0,
        max: 10,
        step: 1,
      },
    ],
  },
  {
    name: 'invert',
    title: '反色',
    multiply: (obj: { invert: boolean; alpha: boolean }) =>
      new fabric.filters.Invert(obj),
    change: [
      {
        id: 'invert',
        name: 'invert',
        type: 'checkbox',
        title: '反色',
      },
      {
        id: 'alpha',
        name: 'alpha',
        type: 'checkbox',
        title: '使用alpha通道',
      },
    ],
  },
];
export const Font: {
  name: string;
  fontSize: string;
  title: string;
  fontWeight: string;
}[] = [
  {
    name: 'h1',
    fontSize: '32px',
    fontWeight: 'bold',
    title: '添加一级标题',
  },
  {
    name: 'h2',
    fontWeight: 'bold',
    fontSize: '24px',
    title: '添加二级标题',
  },
  {
    name: 'h3',
    fontWeight: 'bold',
    fontSize: '18px',
    title: '添加三级标题',
  },
  {
    name: 'h4',
    fontSize: '16px',
    fontWeight: 'bold',
    title: '添加四级标题',
  },
  {
    name: 'h5',
    fontSize: '13.8px',
    fontWeight: 'bold',
    title: '添加五级标题',
  },
  {
    name: 'h6',
    fontSize: '12px',
    fontWeight: 'bold',
    title: '添加六级标题',
  },
  { name: 'p', fontSize: '16px', fontWeight: 'normal', title: '添加段落' },
];

//颜色预设
export const JSON_KEY = [
  'name',
  'gradientAngle',
  'selectable',
  'hasControls',
  'linkData',
  'editable',
  'extensionType',
  'extension',
  'filtersArray',
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
  'transparent',
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
export type FontWeightType = 'normal' | 'bold';
//返回
export const FILL_COLOR = 'rgba(0,0,0,1)';
export const STROKE_COLOR = 'rgba(0,0,0,1)';
export const DIAMOD_WIDTH = 300;
export const DIAMOD_HEGHT = 300;
export const STROKE_WIDTH = 1;
export const STROKE_DASH_ARRAY = [];
export const OPACITY = 0;
export const FONT_FAMILY = 'Arial';
export const FONT_SIZE = 32;
export const FONT_WEIGHT = 'normal';
export const FONT_THOUGHT = false;
export const FONT_UNDERLINE = false;
export const FONT_ITALICS = 'normal';
export const FONT_ALIGN = 'left';
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1100;
export const CANVAS_COLOR = '#ffffff';

export const IMAGE_BLUSK =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/';

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
export type FontStyle = 'normal' | 'italic';
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
  'Arial',
  'Arial Black',
  'Verdana',
  'Hevetica',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT',
  'Palatino',
  'Bookman',
  'Comic Sans MS',
  'Impact',
  'Lucida Sans Unicode',
  'Geneva',
  'Lucida Grande',
];
export type Filter =
  | 'none'
  | 'polaroid'
  | 'sepia'
  | 'kodachrome'
  | 'contrast'
  | 'brightness'
  | 'brownie'
  | 'vintage'
  | 'grayscale'
  | 'invert'
  | 'technicolor'
  | 'pixelate'
  | 'blur'
  | 'sharpen'
  | 'emboss'
  | 'removecolor'
  | 'blackwhite'
  | 'vibrance'
  | 'blendcolor'
  | 'huerotation'
  | 'resize'
  | 'saturation'
  | 'gamma';
export const filters: Filter[] = [
  'none',
  'polaroid',
  'sepia',
  'kodachrome',
  'contrast',
  'brightness',
  'brownie',
  'vintage',
  'grayscale',
  'invert',
  'technicolor',
  'pixelate',
  'blur',
  'sharpen',
  'emboss',
  'removecolor',
  'blackwhite',
  'vibrance',
  'blendcolor',
  'huerotation',
  'resize',
  'saturation',
  'gamma',
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
  fontAlign: fabric.Textbox['textAlign'];
  fontSize: number;
  imageLoading: boolean;
  imageFilter: string[];
  drewColor: string;
  drawWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasColor: string;
  canvasHistory: fabric.FabricObject[];
  userId: string | undefined;
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
  setImageFilter: (imageFilter: string[]) => void;
  setImageLoading: (imageLoading: boolean) => void;
  setFontSize: (fontSize: number) => void;
  setFontAlign: (fontAlign: fabric.Textbox['textAlign']) => void;
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
  fontAlign: fabric.Textbox['textAlign'];
  fontSize: number;
  imageLoading: boolean;
  imageFilter: string[];
  drewColor: string;
  drawWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasColor: string;
  canvasHistory: fabric.FabricObject[];
  getActiveFilterIndex: (filter: string) => number;
  fixImageSize: (imageObj: fabric.FabricImage) => void;
  changeImageFilterSetting: (filter: string, value: Effect | null) => void;
  getActiveFilterEffect: (filter: string) => Effect | null;
  cleanFilter: () => void;
  deleteImageFilter: (filter: string) => void;
  savePng: () => void;
  saveSvg: () => void;
  savejpg: () => void;
  saveJson: () => void;
  loadFromJson: (json: string) => void;
  pasty: () => void;

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
  getActiveFilter: () => string[];
  changeImageFilter: (filter: string) => void;
  addImage: (url: string) => void;
  delete: () => void;
  addText: (text: string, option?: fabric.Textbox | object) => void;
  bringForward: () => void;
  getActiveFontLineThrough: () => boolean;
  getActiveFontUnderline: () => boolean;
  getActiveFontSize: () => number;
  getActiveFontItalic: () => FontStyle;
  getActiveFontAlign: () => fabric.Textbox['textAlign'];
  changeFontAlign: (value: fabric.Textbox['textAlign']) => void;
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
  [Tool.Fill]: '填充颜色',
  [Tool.StrokeColor]: '描边颜色',
  [Tool.StrokeWidth]: '边框宽度',
  [Tool.Opacity]: '透明度',
  [Tool.FontFamily]: '字体类型',
  [Tool.Filter]: '滤镜',
  [Tool.Settings]: '设置',
  [Tool.Draw]: '画笔',
  [Tool.FilterSetting]: '滤镜设置',
  '': '',
};

export const FilterItem = {
  none: '无',
  polaroid: '偏振',
  sepia: '棕褐色',
  kodachrome: '彩色胶片',
  contrast: '对比度',
  brightness: '亮度',
  brownie: '棕褐色',
  vintage: '复古',
  grayscale: '灰度',
  invert: '反色',
  technicolor: '科技',
  pixelate: '像素化',
  blur: '模糊',
  sharpen: '锐化',
  emboss: '滤波',
  removecolor: '去色',
  blackwhite: '黑白',
  vibrance: '色彩',
  blendcolor: '混合颜色',
  huerotation: '色调旋转',
  resize: '调整大小',
  saturation: '饱和度',
  gamma: '伽马',
};
export const PAGE_SIZE = 7;
export enum ImageType {
  Cloud,
  Recommend,
}
