import { nanoid } from "nanoid";
import { supabaseJebt } from "../../../server/supabase/jebt";
import { Workspace } from "../../../types/jebt/board";

const JEBT_URL =
  "https://xllpazcrvbmwkyvnpylu.supabase.co/storage/v1/object/public/";
/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
interface UploadImageClound {
  file: File;
}
export const uploadImageclound = async ({ file }: UploadImageClound) => {
  // 设置照片名字
  const fileName = `${nanoid()}-${file.name}`.replace("/", "");
  const { data, error } = await supabaseJebt.storage
    // 桶名字
    .from("USER_IMAGE")
    .upload(fileName, file);
  if (error) {
    // Handle error
    throw new Error(error.message);
  }
  return JEBT_URL + data.fullPath;
};
/**
 * @description 删除图片
 * @param image 图片路径
 * @returns 图片路径
 */
interface DeleteImageClound {
  image: string;
}
export const deleteImageClound = async ({
  image,
}: DeleteImageClound): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabaseJebt.storage
    //  桶名字
    .from("UPLOAD_IMG")
    // 删除图片路径
    .remove([image]);
  if (error) {
    throw new Error(error.message);
  }
  return { data, error };
};

/**
 * 创建仪表盘
 * @param param0
 * @returns
 */
export const createJebtWorkspace = async ({
  name,
  userId,
  file,
}: {
  name: string;
  userId: string;
  file: File | string;
}): Promise<Workspace> => {
  console.log(file);
  if (typeof file !== "string") {
    const imageUrl = await uploadImageclound({ file });
    const { data, error } = await supabaseJebt
      .from("workspace")
      .insert([{ name, userId: userId, imageUrl: imageUrl }])
      .select("*");
    if (error) throw new Error(error.message);
    return data[0];
  } else {
    const { data, error } = await supabaseJebt
      .from("workspace")
      .insert([{ name, userId: userId, imageUrl: file }])
      .select("*");
    if (error) throw new Error(error.message);
    return data[0];
  }
};

/**
 * 获取仪表盘
 */
export const getJebtWorkspace = async (
  userId: string
): Promise<Workspace[]> => {
  const { data, error } = await supabaseJebt
    .from("workspace")
    .select("*")
    .eq("userId", userId);
  if (error) throw new Error(error.message);
  console.log(data, error);
  return data;
};
