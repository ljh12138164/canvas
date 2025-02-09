import type { Board } from '../../../types/design/board';
import { supabaseDesign } from '../../supabase/design';
import { DEFAULT_TEMPLATE, uploadCustomType } from '../board';

export const cloneBoardOrTemplate = async ({
  type,
  name,
  id,
  userId,
  token,
  cloneId,
  json,
  image,
}: {
  type: 'template' | 'board';
  name: string;
  id: string;
  userId: string;
  token: string;
  json: any;
  cloneId: string;
  image: string;
}): Promise<Board> => {
  let uploadImageUrl = '';
  if (image === DEFAULT_TEMPLATE) {
    uploadImageUrl = image;
  } else {
    const response = await fetch(image);
    // 将base64转换为Blob
    const blob = await response.blob();

    // 上传图片
    uploadImageUrl = await uploadCustomType({
      base64: blob,
      fullType: 'image/webp',
      imageName: id,
    });
  }
  const { data, error } = await supabaseDesign(token)
    .from('board')
    .insert([{ userId, name, id, isTemplate: type === 'template', json, image: uploadImageUrl }])
    .select('*');
  if (error) throw error;
  const { data: cloneData, error: cloneError } = await supabaseDesign(token)
    .from('board')
    .select('*')
    .eq('id', cloneId);
  if (cloneError) throw cloneError;
  await supabaseDesign(token)
    .from('board')
    .update({ clone: cloneData[0].clone + 1 })
    .eq('id', cloneId);
  if (error) throw error;
  return data[0];
};
