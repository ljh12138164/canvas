import { auth } from "@/auth";
import { supabase } from "@/database/supbash";
import { Session } from "next-auth";
/**
 * @description 检查session
 * @returns supabaseClient
 */
export const checkSession = async (): Promise<Session | null> => {
  return await auth();
};

/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
interface UploadImageClound {
  file: File;
}
export const uploadImageclound = async ({ file }: UploadImageClound) => {
  const fileName = `${Math.random()}-${file.name}`.replace("/", "");
  const { data, error } = await supabase.storage
    .from("UPLOAD_IMG")
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
interface DeleteImageClound extends Session {
  image: string;
}
export const deleteImageClound = async ({ image }: DeleteImageClound) => {
  const { data, error } = await supabase.storage
    .from("UPLOAD_IMG")
    .remove([image]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
