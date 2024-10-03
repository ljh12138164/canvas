import { LuChevronsLeft } from "react-icons/lu";
interface ToolSiderbarCloseProps {
  onClose: () => void;
}
const ToolSiderbarClose = ({ onClose }: ToolSiderbarCloseProps) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white shadow-md group"
    >
      <LuChevronsLeft className="size-4 text-black group-hover:opacity-70 transition"></LuChevronsLeft>
    </button>
  );
};

export default ToolSiderbarClose;
