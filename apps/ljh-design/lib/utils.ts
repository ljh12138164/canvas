import { clsx, type ClassValue } from "clsx";
import * as fabric from "fabric";
import { FabricObject } from "fabric";
import { RGBColor } from "react-color";
// import * as jose from 'jose';
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
import { hashSync } from "bcryptjs";

export function hashPassword(password: string) {
  return hashSync(password, 10);
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function rgbaObjToString(color: RGBColor | "transparent") {
  if (color === "transparent") {
    return "rgba(0, 0, 0, 0)";
  }
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || 1})`;
}
export function isText(fabricObject: FabricObject) {
  if (!fabricObject) return false;
  return (
    fabricObject.type === "i-text" ||
    fabricObject.type === "text" ||
    fabricObject.type === "textbox"
  );
}
export type Effect = fabric.filters.BaseFilter<
  string,
  Record<string, any>
> | null;
export function createFilter(value: string): Effect {
  let effect: Effect = null;
  switch (value) {
    // 偏色
    case "polaroid":
      effect = new fabric.filters.Polaroid();
      break;
    // 褐色
    case "sepia":
      effect = new fabric.filters.Sepia();
      break;
    // 柯达
    case "kodachrome":
      effect = new fabric.filters.Kodachrome();
      break;
    // 对比度
    case "contrast":
      effect = new fabric.filters.Contrast({ contrast: 0.1 });
      break;
    // 亮度
    case "brightness":
      effect = new fabric.filters.Brightness({ brightness: 0.8 });
      break;
    // 棕色
    case "brownie":
      effect = new fabric.filters.Brownie();
      break;
    // 复古
    case "vintage":
      effect = new fabric.filters.Vintage();
      break;
    // 灰度
    case "grayscale":
      effect = new fabric.filters.Grayscale();
      break;
    // 反色
    case "invert":
      effect = new fabric.filters.Invert();
      break;
    // 技术
    case "technicolor":
      effect = new fabric.filters.Technicolor();
      break;
    // 像素化
    case "pixelate":
      effect = new fabric.filters.Pixelate();
      break;
    // 模糊
    case "blur":
      effect = new fabric.filters.Blur({ blur: 0.5 });
      break;
    // 锐化
    case "sharpen":
      effect = new fabric.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    // 浮雕
    case "emboss":
      effect = new fabric.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    // 移除颜色
    case "removecolor":
      effect = new fabric.filters.RemoveColor({
        // 设置要移除的颜色
        color: "#222",
        // 设置距离
        distance: 0.5,
        // 使用alpha通道
        useAlpha: true,
      });
      break;
    // 黑白
    case "blackwhite":
      effect = new fabric.filters.BlackWhite();
      break;
    // 饱和度
    case "vibrance":
      effect = new fabric.filters.Vibrance({
        vibrance: 10,
      });
      break;
    // 混合
    case "blendcolor":
      effect = new fabric.filters.BlendColor({
        color: "red",
        mode: "multiply",
        alpha: 1,
      });
      break;
    // 色相
    case "huerotation":
      effect = new fabric.filters.HueRotation({
        rotation: 1,
      });
      break;
    // 调整大小
    case "resize":
      effect = new fabric.filters.Resize({
        resizeType: "bilinear",
        scaleX: 1,
        scaleY: 1,
        lanczosLobes: 3,
      });
      break;
    // 饱和度
    case "saturation":
      effect = new fabric.filters.Saturation({
        saturation: 1,
      });
      break;
    // 伽马
    case "gamma":
      effect = new fabric.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
      break;
    // 默认
    default:
      effect = null;
  }
  return effect;
}

export function downloadImage(file: string, type: string) {
  const a = document.createElement("a");
  a.href = file;
  a.download = `${nanoid()}.${type}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
export function transformToTest(objects: any) {
  if (!objects) return;
  [objects].forEach((item: any) => {
    if (item?.objects) {
      transformToTest(item.objects);
    }
  });
}

// export async function jwtEncode(payload: any) {
//   const JWT_SECRET = new TextEncoder().encode(
//     process.env.NEXT_PUBLIC_JWT_SECRET!
//   );
//   const token = await new jose.SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setExpirationTime('30d')
//     .sign(JWT_SECRET);
//   return token;
// }
export function debounce(fn: () => void, delay: number = 300) {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, delay);
  };
}
