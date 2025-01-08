import { supabaseNote, supabaseNoteWebhook } from "../../supabase/note/index";

/**
 * @param document 文档
 * @param documentName 文档名称
 */
export const saveDocument = async ({
  document,
  documentName,
}: {
  document: any;
  documentName: string;
}) => {
  console.log(document, documentName);
  const { data, error } = await supabaseNoteWebhook
    .from("workspace")
    .select("*,profiles(*),folders(*,files(*)),collaborators(*)")
    .eq("id", documentName);
  if (error) throw new Error("服务器错误");

  throw new Error("无权限");
};
