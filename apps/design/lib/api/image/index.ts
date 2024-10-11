import { supabase } from "@/database/supbash";

export const uploadImageclound = async (file: File) => {
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
//删除图片
export const deleteImageClound = async (image: string) => {
  const { data, error } = await supabase.storage
    .from("UPLOAD_IMG")
    .remove([image]);
  if (error) {
    // Handle error
    throw new Error(error.message);
  }
  return data;
};
