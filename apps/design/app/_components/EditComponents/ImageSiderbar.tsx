import { cn } from "@/lib/utils";
import type { Edit } from "@/types/Edit";
import { Tool } from "@/types/Edit";

import { useImageQuery } from "@/api/getImage/useQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { LuAlertTriangle, LuLoader } from "react-icons/lu";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";

interface ImageSiderbarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const ImageSiderbar = ({
  activeTool,
  onChangeActive,
  editor,
}: ImageSiderbarProps) => {
  const { getImageLoading, imageData, getImageError } = useImageQuery();
  return (
    <aside
      className={cn(
        "z-[100] bg-white  relative transition  h-full flex flex-col",
        activeTool === Tool.Image ? "visible" : "hidden"
      )}
      style={{ flexBasis: "300px" }}
    >
      <ToolSiderbar title="图片" description="插入图片"></ToolSiderbar>
      {getImageLoading && (
        <div className="flex justify-center items-center flex-1">
          <LuLoader className="size-4 text-muted-foreground animate-spin"></LuLoader>
        </div>
      )}
      {getImageError && (
        <div className="flex flex-col gap-y-4 justify-center items-center flex-1">
          <LuAlertTriangle className="size-4  text-muted-foreground"></LuAlertTriangle>
          <p className=" text-muted-foreground text-xs">获取图片失败</p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4 pb-20 grid grid-cols-2 gap-4">
          {imageData &&
            imageData.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    editor?.addImage(item.urls.regular);
                  }}
                  className="relative w-full  h-[100px]  hover:opacity-75 transition bg-muted rounded-sm overflow-hidden group border"
                >
                  <Image
                    src={item.urls.small}
                    fill
                    quality="75"
                    sizes="100%"
                    alt={item?.alt_description || "插入图片"}
                    className="object-cover"
                  ></Image>
                  <Link
                    href={item.links.html}
                    target="_blank"
                    className="opacity-0 group-hover:opacity-100 absolute w-full left-0 bottom-0 text-[10px] bg-black/50 text-white p-1 text-left"
                  >
                    {item.user.name}
                  </Link>
                </button>
              );
            })}
        </div>
      </ScrollArea>
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default ImageSiderbar;
