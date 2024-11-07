import { Board } from "@/types/board";
import { CiFileOn } from "react-icons/ci";
import TooltipComponents from "../shadui-Components/Tooltip";

const BoardItem = ({ board }: { board: Board }) => {
  return (
    <>
      <div className="w-full h-[3.5rem] px-2 py-1 rounded-sm bg-card grid grid-cols-[1fr,0.7fr,1fr,0.5fr]">
        <div className="flex items-center gap-1 min-w-[100px] text-ellipsis">
          <CiFileOn className="size-8 min-w-[2rem]" />
          <TooltipComponents label={board.name}>
            <span className="text-ellipsis block overflow-hidden ">
              {board.name}
            </span>
          </TooltipComponents>
        </div>
        <div className="flex items-center justify-center text-ellipsis overflow-hidden ">
          <TooltipComponents label={board.name}>
            <span className="text-ellipsis block overflow-hidden">
              {board.width}x{board.height}
              <span className="ml-1">px</span>
            </span>
          </TooltipComponents>
        </div>
        <div className="flex items-center justify-center">sdf</div>
        <div className="flex items-center justify-center">sdf</div>
      </div>
      <div className="border-b"></div>
    </>
  );
};

export default BoardItem;
