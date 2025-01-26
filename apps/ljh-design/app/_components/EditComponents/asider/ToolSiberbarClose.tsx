import { LuChevronsLeft } from 'react-icons/lu';
interface ToolSiderbarCloseProps {
  onClose: () => void;
}
const ToolSiderbarClose = ({ onClose }: ToolSiderbarCloseProps) => {
  return (
    <button
      onClick={onClose}
      type="button"
      className="absolute top-[45%] right-[-7.5%] z-10 p-1 h-[3rem] rounded-r-lg bg-white dark:bg-background border-slate-900/5 border-2 border-l-white dark:border-l-background   group"
    >
      <LuChevronsLeft className="size-4 text-black group-hover:opacity-70 transition dark:text-white" />
    </button>
  );
};

export default ToolSiderbarClose;
