// import { useGetUserImage } from '@/hook/query/useImageQuery';
import { useBoardImageQuery, useDeleteUserImageQuery } from '@/app/_hook/query/useImageQuery';
import type { Edit } from '@/app/_types/Edit';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { LuBadgeAlert, LuLoader } from 'react-icons/lu';
export const UserImageBox = ({
  editor,
  userId,
}: {
  editor: Edit | undefined;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useBoardImageQuery({ userId });
  const { mutate, isPending } = useDeleteUserImageQuery();
  return (
    <>
      {Array.isArray(data) &&
        data.map((item, index) => {
          return (
            <button
              disabled={(isLoading || error) === true}
              key={item.id}
              onClick={() => {
                if (!isLoading || !error) editor?.addImage(item.url);
              }}
              type="button"
              className="relative w-full  h-[100px] group  hover:opacity-75 transition bg-muted rounded-sm overflow-hidden group border"
            >
              <Image
                src={item.url}
                fill
                quality="75"
                priority={true}
                sizes="100%"
                alt="用户图片"
                className="object-cover"
              />
              <X
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPending) return;
                  toast.loading('删除中...');
                  mutate(
                    { json: { id: item.id, url: item.url } },
                    {
                      onSuccess: () => {
                        toast.dismiss();
                        toast.success('删除成功');
                        queryClient.invalidateQueries({ queryKey: ['boardImage'] });
                      },
                    },
                  );
                }}
                type="button"
                className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 size-4 text-muted-foreground transition-all duration-300"
              />
              <Link
                href={item.url}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 absolute w-full left-0 bottom-0 text-[10px] bg-black/50 text-white p-1 text-left transition-all duration-300"
              >
                {index + 1}
              </Link>
            </button>
          );
        })}
      {isLoading && <LuLoader className="size-4 text-muted-foreground animate-spin" />}
      {error && !isLoading && (
        <div className="flex flex-col gap-y-4 justify-center items-center flex-1">
          <LuBadgeAlert className="size-4  text-muted-foreground" />
          <p className=" text-muted-foreground text-xs">获取图片失败</p>
        </div>
      )}
      {Array.isArray(data) && data.length === 0 && (
        <div className="flex justify-center items-center text-sm text-muted-foreground w-full h-full">
          用户无上传图片
        </div>
      )}
    </>
  );
};
