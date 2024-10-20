import { auth } from "@/auth";
/**
 * @description 检查session
 * @returns supabaseClient
 */
export const checkSession = async () => {
  return await auth();
};

/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
export const uploadImageclound = async (file: File) => {
  const supabase = await checkSession();
  console.log(supabase);
  if (!supabase) {
    throw new Error("未登录");
  }
  console.log(supabase);
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
export const deleteImageClound = async (image: string) => {
  const supabase = await checkSession();
  if (!supabase) {
    throw new Error("未登录");
  }
  const { data, error } = await supabase.storage
    .from("UPLOAD_IMG")
    .remove([image]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
