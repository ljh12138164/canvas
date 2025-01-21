import { Tool } from '@/app/_types/Edit';
import { LuSettings } from 'react-icons/lu';
interface ImageSettingProps {
  isShow: boolean;
  onChangeActive: (tool: Tool) => void;
  activeTool: Tool;
  filter: string;
  setFilterSetting: (filter: string) => void;
}
const ImageSetting = ({ isShow, filter, onChangeActive, setFilterSetting }: ImageSettingProps) => {
  return (
    <div
      className={` absolute top-[50%] right-[5%] translate-y-[-50%] transition-all duration-300 ease-in-out size-6 hover:bg-slate-200 rounded-full p-1 ${!isShow && 'hidden'}`}
      onMouseEnter={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onChangeActive(Tool.FilterSetting);
        setFilterSetting(filter);
      }}
    >
      <LuSettings className="h-full w-full" />
    </div>
  );
};

export default ImageSetting;
