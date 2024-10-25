import { Tool } from "@/types/Edit";
import { Button } from "@/components/ui/button";
import { LuMinimize, LuZoomIn, LuZoomOut } from "react-icons/lu";
import { Edit } from "@/store/editor";
import TooltipComponents from "@/components/shadui-Components/Tooltip";
interface FooterProps {
  editor: Edit | undefined;
}
const Footer = ({ editor }: FooterProps) => {
  return (
    <div className="h-[50px] border-r bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse">
      <TooltipComponents
        label="放大"
        side="bottom"
        sideOffset={5}
        key={Tool.zoomIn}
      >
        <Button
          className="h-full"
          size="icon"
          variant="ghost"
          onClick={() => editor?.zoomIn()}
        >
          <LuZoomIn></LuZoomIn>
        </Button>
      </TooltipComponents>
      <TooltipComponents
        label="缩小"
        side="bottom"
        sideOffset={5}
        key={Tool.zoomOut}
      >
        <Button
          className="h-full"
          onClick={() => editor?.zoomOut()}
          size="icon"
          variant="ghost"
        >
          <LuZoomOut></LuZoomOut>
        </Button>
      </TooltipComponents>
      <TooltipComponents
        label="重置"
        side="bottom"
        sideOffset={5}
        key={Tool.zoomResize}
      >
        <Button
          className="h-full"
          onClick={async () => await editor?.authZoom()}
          size="icon"
          variant="ghost"
        >
          <LuMinimize></LuMinimize>
        </Button>
      </TooltipComponents>
    </div>
  );
};

export default Footer;
