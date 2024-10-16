import TooltipComponents from "@/components/shadui-Components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { CiFileOn } from "react-icons/ci";
import { BsCloudCheck } from "react-icons/bs";
import {
  LuChevronDown,
  LuDownload,
  LuFile,
  LuMousePointerClick,
  LuRedo2,
  LuUndo2,
} from "react-icons/lu";
import Logo from "../Comand/Logo";
import { Tool } from "../../../types/Edit";
import { Edit } from "@/store/editor";
interface NavBarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeTool: (tool: Tool) => void;
}
const NavBar = ({ activeTool, onChangeTool, editor }: NavBarProps) => {
  return (
    <nav className="w-full text-xl font-medium h-[4rem] bg-white flex items-center px-4 border-b border-gray-200 justify-center  xl:justify-start">
      <Logo></Logo>
      <div className="ml-4 w-full flex gap-4 h-[4rem] items-center ">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="font-bold text-xl">
              文件
              <LuChevronDown size={20} className="ml-2"></LuChevronDown>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60 z-[1000]">
            <DropdownMenuItem
              onClick={() => {}}
              className="flex items-center gap-2 px-4 "
            >
              <CiFileOn size={30}></CiFileOn>
              <div className="z-[1000]">
                <p>打开</p>
                <p className="text-xs  opacity-45">请选择json文件</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2 h-[60%]" />
        <TooltipComponents label="预览">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              onChangeTool(Tool.Select);
            }}
            className={`${activeTool === Tool.Select && "bg-gray-100"}`}
          >
            <LuMousePointerClick size="20" />
          </Button>
        </TooltipComponents>
        <TooltipComponents label="撤销">
          <Button
            disabled={!editor?.canUndo()}
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              editor?.undo();
            }}
            className=""
          >
            <LuUndo2 size="20"></LuUndo2>
          </Button>
        </TooltipComponents>
        <TooltipComponents label="重做">
          <Button
            disabled={!editor?.canRedo()}
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              editor?.redo();
            }}
            className=""
          >
            <LuRedo2 size="20"></LuRedo2>
          </Button>
        </TooltipComponents>
        <Separator orientation="vertical" className="mx-2 h-[60%]" />
        <div className="flex items-center gap-2 opacity-70">
          <BsCloudCheck size={20} />
          <div className="text-xs text-muted-foreground">保存成功</div>
        </div>
        <div className="ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="w-20 font-bold flex items-center justify-center gap-2"
              >
                <p>导出</p>
                <LuDownload size="18"></LuDownload>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem className="flex items-center gap-2">
                <LuFile size={20}></LuFile>
                <div className="flex flex-col">
                  <p className="text-xs font-bold">JSON</p>
                  <p className="text-xs text-muted-foreground">
                    保存最后一次编辑
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <LuFile size={20}></LuFile>
                <div className="flex flex-col">
                  <p className="text-xs font-bold">PNG</p>
                  <p className="text-xs text-muted-foreground">
                    可以分享给别人看
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <LuFile size={20}></LuFile>
                <div className="flex flex-col">
                  <p className="text-xs font-bold">JPG</p>
                  <p className="text-xs text-muted-foreground">
                    可以分享给别人看
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <LuFile size={20}></LuFile>
                <div className="flex flex-col">
                  <p className="text-xs font-bold">SVG</p>
                  <p className="text-xs text-muted-foreground">
                    可在其他的矢量软件中使用
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
NavBar.displayName = "EditNavBar";
export default NavBar;
