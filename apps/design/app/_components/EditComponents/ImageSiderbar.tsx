import { cn } from "@/lib/utils";
import { IMAGE_BLUSK, Tool } from "@/types/Edit";

import { useImageQuery } from "@/api/Image/useQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { uploadImageclound } from "@/lib/api/image";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { LuAlertTriangle, LuLoader } from "react-icons/lu";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";
import { Edit } from "@/store/editor";

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
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploadImage, setUploadImage] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadImage(true);
    toast.loading("上传图片中...");
    try {
      if (e.target.files?.[0]) {
        const url = await uploadImageclound(e.target.files?.[0]);
        toast.dismiss();
        if (editor) {
          editor.addImage(IMAGE_BLUSK + url);
        }
      }
    } catch (error) {
      toast.dismiss();
      console.log(error.message);
      console.error(error);
      toast.error("上传失败");
    } finally {
      setUploadImage(false);
      //修改bug：上传图片后，input的value会变成null，导致无法再次上传同一张图片
      e.target.value = "";
    }
  };

  return (
    <aside
      className={cn(
        "z-[100] bg-white  relative transition  h-full flex flex-col",
        activeTool === Tool.Image ? "visible" : "hidden"
      )}
      style={{ flexBasis: "300px" }}
    >
      <ToolSiderbar title="图片" description="插入图片"></ToolSiderbar>
      <ScrollArea className="scroll-mt-12">
        <div className="h-16  relative  border-b-2  flex items-center justify-center border-black/10 px-4 py-2">
          <button
            onClick={() => {
              if (!uploadImage) fileRef.current?.click();
            }}
            disabled={uploadImage || editor?.imageLoading}
            className={`flex items-center justify-center bg-blue-500 w-full h-full rounded-md  cursor-pointer ${uploadImage && " opacity-50"}`}
          >
            <p className="text-white font-medium">上传图片</p>
            <input
              accept="image/gif, image/jpeg, image/png"
              type="file"
              className="hidden"
              ref={fileRef}
              onChange={handleFileChange}
            />
          </button>
        </div>
        <div className="p-4 pb-20 grid grid-cols-2 gap-4 mt-4">
          {imageData &&
            imageData.map((item) => {
              return (
                <button
                  disabled={uploadImage || editor?.imageLoading}
                  key={item.id}
                  onClick={() => {
                    if (!uploadImage || editor?.imageLoading)
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
      {getImageLoading && (
        <div className="flex justify-center items-center h-full">
          <LuLoader className="size-4 text-muted-foreground animate-spin"></LuLoader>
        </div>
      )}
      {getImageError && (
        <div className="flex flex-col gap-y-4 justify-center items-center flex-1">
          <LuAlertTriangle className="size-4  text-muted-foreground"></LuAlertTriangle>
          <p className=" text-muted-foreground text-xs">获取图片失败</p>
        </div>
      )}
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default ImageSiderbar;
