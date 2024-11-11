import { ScrollArea } from '@/components/ui/scroll-area';
import { useImageQuery } from '@/hook/query/useImageQuery';
import { cn } from '@/lib/utils';
import { Edit, IMAGE_BLUSK, ImageType, Tool } from '@/types/Edit';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { LuAlertTriangle, LuLoader } from 'react-icons/lu';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ImageBox } from './ImageBox';
import ToolSiderbarClose from './ToolSiberbarClose';
import ToolSiderbar from './ToolSiderbar';
import { UserImageBox } from './UserImageBox';
import { uploadImageclound } from '@/server/image';
interface ImageSiderbarProps {
  editor: Edit | undefined;
  userId: string | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const ImageSiderbar = ({
  activeTool,
  onChangeActive,
  editor,
  userId,
}: ImageSiderbarProps) => {
  const { getImageLoading, getImageError } = useImageQuery();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imageList, setImageList] = useState<ImageType>(ImageType.Recommend);
  const [uploadImage, setUploadImage] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadImage(true);
    toast.loading('上传图片中...');
    try {
      if (e.target.files?.[0]) {
        if (userId) {
          const url = await uploadImageclound({
            file: e.target.files?.[0],
          });
          toast.dismiss();
          if (editor) {
            editor.addImage(IMAGE_BLUSK + url);
          }
        } else {
          toast.dismiss();
          const url = URL.createObjectURL(e.target.files?.[0]);
          if (editor) {
            editor.addImage(url);
          }
        }
      }
    } catch {
      toast.dismiss();
      toast.error('上传失败');
    } finally {
      setUploadImage(false);
      e.target.value = '';
    }
  };

  return (
    <aside
      className={cn(
        'z-[100] bg-white  relative transition  h-full flex flex-col',
        activeTool === Tool.Image ? 'visible' : 'hidden'
      )}
      style={{ flexBasis: '300px' }}
    >
      <ToolSiderbar title='图片' description='插入图片'></ToolSiderbar>
      {userId && (
        <>
          <div className='flex gap-x-2 px-4 my-2'>
            <Button
              variant='ghost'
              className={`${imageList === ImageType.Recommend && 'bg-muted'} w-full`}
              onClick={() => setImageList(ImageType.Recommend)}
            >
              <span className='text-sm font-medium'>推荐</span>
            </Button>
            <Button
              variant='ghost'
              className={` ${imageList === ImageType.Cloud && 'bg-muted'} w-full`}
              onClick={() => setImageList(ImageType.Cloud)}
            >
              <span className='text-sm font-medium'>用户图片</span>
            </Button>
          </div>
          <Separator orientation='horizontal'></Separator>
        </>
      )}
      <ScrollArea className='scroll-mt-12'>
        <div className='h-16  relative  border-b-2  flex items-center justify-center border-black/10 px-4 py-2'>
          <button
            onClick={() => {
              if (!uploadImage) fileRef.current?.click();
            }}
            disabled={uploadImage || editor?.imageLoading}
            className={`flex items-center justify-center bg-blue-500 w-full h-full rounded-md  cursor-pointer ${uploadImage && ' opacity-50'}`}
          >
            <p className='text-white font-medium'>上传图片</p>
            <input
              accept='image/gif, image/jpeg, image/png'
              type='file'
              className='hidden'
              ref={fileRef}
              onChange={handleFileChange}
            />
          </button>
        </div>
        <div className='p-4 pb-20 grid grid-cols-2 gap-4 mt-4'>
          {activeTool === Tool.Image && imageList === ImageType.Recommend && (
            <ImageBox editor={editor}></ImageBox>
          )}
          {activeTool === Tool.Image &&
            imageList === ImageType.Cloud &&
            userId && (
              <UserImageBox editor={editor} userId={userId}></UserImageBox>
            )}
        </div>
      </ScrollArea>

      {getImageLoading && imageList === ImageType.Recommend && (
        <div className='flex justify-center items-center h-full'>
          <LuLoader className='size-4 text-muted-foreground animate-spin'></LuLoader>
        </div>
      )}
      {getImageError && imageList === ImageType.Recommend && (
        <div className='flex flex-col gap-y-4 justify-center items-center flex-1'>
          <LuAlertTriangle className='size-4  text-muted-foreground'></LuAlertTriangle>
          <p className=' text-muted-foreground text-xs'>获取图片失败</p>
        </div>
      )}
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default ImageSiderbar;
