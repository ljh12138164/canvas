import { clsx, type ClassValue } from "clsx";
import { FabricObject } from "fabric";
import { RGBColor } from "react-color";
import { twMerge } from "tailwind-merge";

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
