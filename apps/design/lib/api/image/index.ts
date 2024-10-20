import { auth } from "@/auth";
import { SessionSupabase, supabaseClient } from "@/database/supbash";
/**
 * @description 检查session
 * @returns supabaseClient
 */
export const checkSession = async (): Promise<SessionSupabase | null> => {
  return (await auth()) as SessionSupabase | null;
};
interface Session {
  session: SessionSupabase | null;
}
/**
 * @description 上传图片到云端
 * @param file 文件
 * @returns 图片路径
 */
interface UploadImageClound extends Session {
  file: File;
}
export const uploadImageclound = async ({
  file,
  session,
}: UploadImageClound) => {
  if (!session) {
    throw new Error("未登录");
  }
  const supabase = await supabaseClient(session);
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
export const deleteImageClound = async ({
  image,
  session,
}: DeleteImageClound) => {
  if (!session) {
    throw new Error("未登录");
  }
  const supabase = await supabaseClient(session);
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
