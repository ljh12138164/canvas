import { useImageQuery } from '@/app/_hook/query/useImageQuery';
import type { Edit } from '@/app/_types/Edit';
import Image from 'next/image';
import Link from 'next/link';

export const ImageBox = ({ editor }: { editor: Edit | undefined }) => {
  const { getImageLoading, imageData, getImageError } = useImageQuery();

  return (
    <>
      {imageData?.map((item) => {
        return (
          <button
            type="button"
            disabled={getImageLoading}
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
          </button>
        );
      })}
    </>
  );
};
