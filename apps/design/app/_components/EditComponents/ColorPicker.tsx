import { rgbaObjToString } from "@/lib/utils";
import { ChromePicker, CirclePicker } from "react-color";
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}
const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        className="border rounded-lg"
        onChangeComplete={(color) => {
          const formatColor = rgbaObjToString(color.rgb);
          onChange(formatColor);
        }}
      />
      <CirclePicker
        color={value}
        onChangeComplete={(color) => {
          const formatColor = rgbaObjToString(color.rgb);
          onChange(formatColor);
        }}
      />
    </div>
  );
};

export default ColorPicker;
