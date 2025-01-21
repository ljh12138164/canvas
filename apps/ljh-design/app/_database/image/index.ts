import supabase from '@/app/_database/supabase';
import { nanoid } from 'nanoid';
/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
interface UploadImageClound {
  file: File;
}
export const uploadImageclound = async ({ file }: UploadImageClound) => {
  const fileName = `${nanoid()}-${file.name}`.replace('/', '');
  const { data, error } = await supabase.storage
    // 桶名字
    .from('UPLOAD_IMG')
    .upload(fileName, file);
  if (error) {
    // Handle error
    throw new Error(error.message);
  }
  return data.fullPath;
};
/**
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
interface DeleteImageClound {
  image: string;
}
export const deleteImageClound = async ({ image }: DeleteImageClound) => {
  const { error } = await supabase.storage
    //  桶名字
    .from('UPLOAD_IMG')
    // 删除图片路径
    .remove([image]);
  if (error) {
    throw new Error(error.message);
  }
  return true;
};
