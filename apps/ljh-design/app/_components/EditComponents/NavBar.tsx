import TooltipComponents from "@/app/_components/shadui-Components/Tooltip";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Separator } from "@/app/_components/ui/separator";
import { Edit, Tool, UserState } from "@/app/_types/Edit";
import { Fragment } from "react";
import { BsCloud, BsCloudCheck } from "react-icons/bs";
import { CiFileOn } from "react-icons/ci";
import {
  LuChevronDown,
  LuDownload,
  LuEye,
  LuFile,
  LuMousePointerClick,
  LuRedo2,
  LuUndo2,
  LuUser,
} from "react-icons/lu";
import { useFilePicker } from "use-file-picker";
import Logo from "../Comand/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { ScrollArea } from "../ui/scroll-area";
interface NavBarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeTool: (tool: Tool) => void;
  isPending?: boolean;
  token: string | undefined;
  userState: [number, UserState][];
}
const NavBar = ({
  activeTool,
  onChangeTool,
  editor,
  isPending,
  token,
  userState,
}: NavBarProps) => {
  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSelected: ({ plainFiles }) => {
      const file = plainFiles[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = () => {
        const json = reader.result;
        editor?.loadFromJson(json as string);
      };
    },
  });
  return (
    <nav className="w-full text-xl font-medium h-[4rem] bg-white flex items-center px-4 border-b border-gray-200 justify-center  xl:justify-start">
      <Logo to={token ? `/board` : "/try/board"}></Logo>
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
              onClick={() => {
                openFilePicker();
              }}
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
        <TooltipComponents label="选择">
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
        <TooltipComponents label="预览">
          <Button variant={"ghost"} size={"icon"}>
            <LuEye size="20" />
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
          >
            <LuRedo2 size="20"></LuRedo2>
          </Button>
        </TooltipComponents>
        <Separator orientation="vertical" className="mx-2 h-[60%]" />
        <div className="flex items-center gap-2 opacity-70">
          {isPending ? (
            <Fragment>
              <BsCloud size={20} />
              <p className="text-xs text-muted-foreground">保存中</p>
            </Fragment>
          ) : (
            <Fragment>
              <BsCloudCheck size={20} />
              <div className="text-xs text-muted-foreground">保存成功</div>
            </Fragment>
          )}
        </div>
        <div className="ml-auto flex items-center gap-x-4">
          <div className="flex items-center gap-2 text-xs">
            <LuUser size={20} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>
                    当前在线：
                    {userState.length}
                  </p>
                </TooltipTrigger>
                <TooltipContent
                  className="z-[1000] max-h-[200px] overflow-y-scroll"
                  asChild
                >
                  <ScrollArea className="max-h-[200px]">
                    <section className="flex flex-col gap-2">
                      {token &&
                        userState &&
                        userState?.map((item) => {
                          return (
                            <div
                              key={item[0]}
                              className="flex items-center gap-2"
                            >
                              <Avatar>
                                <AvatarImage src={item[1].image}></AvatarImage>
                                <AvatarFallback className="bg-gray-200">
                                  {item[1].name}
                                </AvatarFallback>
                              </Avatar>
                              <TooltipProvider>
                                <Tooltip>
                                  <p className="text-xs  text-ellipsis max-w-14 whitespace-nowrap">
                                    {item[1].name}
                                    {item[1].isSelf && "（我）"}
                                  </p>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          );
                        })}
                    </section>
                  </ScrollArea>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

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
            <DropdownMenuContent align="end" className="min-w-40 z-[1000]">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => editor?.saveJson()}
              >
                <LuFile size={20}></LuFile>
                <div className="flex flex-col">
                  <p className="text-xs font-bold">JSON</p>
                  <p className="text-xs text-muted-foreground">
                    保存最后一次编辑
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => editor?.savePng()}
              >
                <LuFile size={20}></LuFile>
                <div className="flex flex-col">
                  <p className="text-xs font-bold">PNG</p>
                  <p className="text-xs text-muted-foreground">
                    可以分享给别人看
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => editor?.savejpg()}
              >
                <LuFile size={20}></LuFile>
                <div className="flex flex-col">
                  <p className="text-xs font-bold">JPG</p>
                  <p className="text-xs text-muted-foreground">
                    可以分享给别人看
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => editor?.saveSvg()}
              >
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
