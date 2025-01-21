// import { useGetUserImage } from '@/hook/query/useImageQuery';
import { useBoardImageQuery } from '@/app/_hook/query/useBoardQuery';
import type { Edit } from '@/app/_types/Edit';
import Image from 'next/image';
import Link from 'next/link';
import { LuBadgeAlert, LuLoader } from 'react-icons/lu';
export const UserImageBox = ({
  editor,
  userId,
}: {
  editor: Edit | undefined;
  userId: string;
}) => {
  const { data, isLoading, error } = useBoardImageQuery({ userId });
  return (
    <div className="flex  items-center justify-center">
      {Array.isArray(data) ? (
        data.map((item, index) => {
          return (
            <button
              disabled={(isLoading || error) === true}
              key={item.imageId}
              onClick={() => {
                if (!isLoading || !error) editor?.addImage(item.url);
              }}
              type="button"
              className="relative w-full  h-[100px]  hover:opacity-75 transition bg-muted rounded-sm overflow-hidden group border"
            >
              <Image src={item.url} fill quality="75" priority={true} sizes="100%" alt="用户图片" className="object-cover" />
              <Link href={item.url} target="_blank" className="opacity-0 group-hover:opacity-100 absolute w-full left-0 bottom-0 text-[10px] bg-black/50 text-white p-1 text-left">
                {index + 1}
              </Link>
            </button>
          );
        })
      ) : (
        <div className="text-center text-sm text-muted-foreground">获取图片失败</div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <LuLoader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {error && !isLoading && (
        <div className="flex flex-col gap-y-4 justify-center items-center flex-1">
          <LuBadgeAlert className="size-4  text-muted-foreground" />
          <p className=" text-muted-foreground text-xs">获取图片失败</p>
        </div>
      )}
      {Array.isArray(data) && data.length === 0 && <div className="flex justify-center items-center text-sm text-muted-foreground w-full h-full">用户无上传图片</div>}
    </div>
  );
};
