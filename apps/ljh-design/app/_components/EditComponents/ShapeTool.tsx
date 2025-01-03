import type { IconType } from "react-icons";
import { cn } from "@/app/_lib/utils";
interface ShapeToolProps {
  Icon: IconType;
  onClick: () => void;
  iconClassName?: string;
}
const ShapeTool = ({ Icon, onClick, iconClassName }: ShapeToolProps) => {
  return (
    <button onClick={onClick} className="aspect-square border rounded-md p-5 ">
      <Icon className={cn("h-full w-full", iconClassName)}></Icon>
    </button>
  );
};

export default ShapeTool;
