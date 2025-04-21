import {
  useBoardImageQuery,
  useDeleteUserImageQuery,
  useImageQuery,
  useUserImageQuery,
} from '@/app/_hook/query/useImageQuery';
import type { Edit } from '@/app/_types/Edit';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaRegStar, FaStar } from 'react-icons/fa';

export const ImageBox = ({
  editor,
  userId,
}: {
  editor: Edit | undefined;
  userId: string | undefined;
}) => {
  const queryClient = useQueryClient();
  const { getImageLoading, imageData, getImageError } = useImageQuery();
  const { data, isLoading, error } = useBoardImageQuery({ userId });
  const { mutate, isPending } = useUserImageQuery();
  // const { }=use
  const { mutate: deleMutate, isPending: deleteLoading } = useDeleteUserImageQuery();
  return (
    <>
      {imageData?.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => {
              if (!getImageLoading || !getImageError) editor?.addImage(item.urls.regular);
            }}
            className="relative w-full  h-[100px]  hover:opacity-75 transition bg-muted rounded-sm overflow-hidden group border"
          >
            <Image
              src={item.urls.small}
              fill
              quality="75"
              priority={true}
              sizes="100%"
              alt={item?.alt_description || '插入图片'}
              className="object-cover"
            />
            <Link
              href={item.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute w-full left-0 bottom-0 text-[10px] bg-black/50 text-white p-1 text-left"
            >
              {item.user.name}
            </Link>
            {userId && (
              <button
                type="button"
                aria-label="图片"
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLoading || error || getImageLoading) return;
                  const isStar = data?.find((user) => user.url === item.urls.small);
                  if (!isStar)
                    return mutate(
                      {
                        json: {
                          url: item.urls.small,
                          star: true,
                        },
                      },
                      {
                        onSuccess: () => {
                          queryClient.invalidateQueries({ queryKey: ['boardImage', userId] });
                          toast.success('收藏成功');
                        },
                      },
                    );
                  // deleMutate({json:{id:item.url}})
                }}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
              >
                {data?.find((user) => user.url === item.urls.small) ? (
                  <FaStar className="size-4" />
                ) : (
                  <FaRegStar className="size-4" />
                )}
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};
