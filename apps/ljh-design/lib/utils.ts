import { clsx, type ClassValue } from "clsx";
import * as fabric from "fabric";
import { FabricObject } from "fabric";
import { RGBColor } from "react-color";
import * as jose from "jose";
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

//
export function createFilter(value: string) {
  let effect;
  switch (value) {
    case "polaroid":
      effect = new fabric.filters.Polaroid();
      break;
    case "sepia":
      effect = new fabric.filters.Sepia();
      break;
    case "kodachrome":
      effect = new fabric.filters.Kodachrome();
      break;
    case "contrast":
      effect = new fabric.filters.Contrast({ contrast: 0.5 });
      break;
    case "brightness":
      effect = new fabric.filters.Brightness({ brightness: 0.8 });
      break;
    case "brownie":
      effect = new fabric.filters.Brownie();
      break;
    case "vintage":
      effect = new fabric.filters.Vintage();
      break;
    case "grayscale":
      effect = new fabric.filters.Grayscale();
      break;
    case "invert":
      effect = new fabric.filters.Invert();
      break;
    case "technicolor":
      effect = new fabric.filters.Technicolor();
      break;
    case "pixelate":
      effect = new fabric.filters.Pixelate();
      break;
    case "blur":
      effect = new fabric.filters.Blur({
        blur: 0.1,
      });
      break;
    case "sharpen":
      effect = new fabric.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    case "emboss":
      effect = new fabric.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    case "removecolor":
      effect = new fabric.filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5,
      });
      break;
    case "blackwhite":
      effect = new fabric.filters.BlackWhite({
        threshold: 0.2,
        distance: 0.5,
      });
      break;
    case "vibrance":
      effect = new fabric.filters.Vibrance({
        vibrance: 1,
      });
      break;
    case "blendcolor":
      effect = new fabric.filters.BlendColor({
        color: "#00ff00",
        mode: "multiply",
      });
      break;
    case "huerotation":
      effect = new fabric.filters.HueRotation({
        rotation: 0.5,
      });
      break;
    case "resize":
      effect = new fabric.filters.Resize();
      break;
    case "saturation":
      effect = new fabric.filters.Saturation({
        saturation: 0.7,
      });
      break;
    case "gamma":
      effect = new fabric.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
      break;
    default:
      effect = null;
      return;
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

export async function jwtEncode(payload: any) {
  const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET!
  );
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
  return token;
}
