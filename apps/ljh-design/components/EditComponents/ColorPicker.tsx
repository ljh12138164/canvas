"use client";
import { rgbaObjToString } from "@/lib/utils";
import { ChromePicker, CirclePicker } from "react-color";
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  noshow?: boolean;
}
const ColorPicker = ({ value, onChange, noshow = false }: ColorPickerProps) => {
  return (
    <div className="w-full space-y-4">
      {/* @ts-ignore */}
      <ChromePicker
        disableAlpha
        color={value}
        className="border rounded-lg"
        onChangeComplete={(color) => {
          const formatColor = rgbaObjToString(color.rgb);
          onChange(formatColor);
        }}
      />
      {!noshow && (
        // @ts-ignore
        <CirclePicker
          color={value}
          onChangeComplete={(color) => {
            console.log(color);
            const formatColor = rgbaObjToString(color.rgb);
            onChange(formatColor);
          }}
        />
      )}
    </div>
  );
};

export default ColorPicker;
