import { Tool } from "@/types/Edit";
import { LuSettings } from "react-icons/lu";
interface ImageSettingProps {
  isShow: boolean;
  onChangeActive: (tool: Tool) => void;
  activeTool: Tool;
}
const ImageSetting = ({ isShow, onChangeActive }: ImageSettingProps) => {
  return (
    <div
      className={` absolute top-[50%] right-[5%] translate-y-[-50%] transition-all duration-300 ease-in-out size-6 hover:bg-slate-200 rounded-full p-1 ${
        !isShow && "hidden"
      }`}
      onMouseEnter={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onChangeActive(Tool.Filter);
      }}
    >
      <LuSettings className="h-full w-full"></LuSettings>
    </div>
  );
};

export default ImageSetting;
