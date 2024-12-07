import { nanoid } from 'nanoid';
import { supabaseNote } from '../supabase/index';
const imageBucket = 'DOCUMENT_IMAGE';
const imagePath =
  'https://dtdgcdckrehydymmxhng.supabase.co/storage/v1/object/public/';
interface UploadImageClound {
  file: File;
}
/**
 * ## 上传图片
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
export const uploadImageclound = async ({ file }: UploadImageClound) => {
  const fileName = `${nanoid()}-${file.name}`.replace('/', '');
  const { data, error } = await supabaseNote.storage
    // 桶名字
    .from(imageBucket)
    .upload(fileName, file);
  if (error) {
    // Handle error
    throw new Error(error.message);
  }
  return imagePath + data.fullPath;
};
/**
 * ## 删除图片
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
interface DeleteImageClound {
  image: string;
}
export const deleteImageClound = async ({ image }: DeleteImageClound) => {
  const { data, error } = await supabaseNote.storage
    //  桶名字
    .from(imageBucket)
    // 删除图片路径
    .remove([image]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
