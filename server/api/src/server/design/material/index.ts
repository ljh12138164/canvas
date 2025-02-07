import type { Material } from '../../../types/design/template';
import { supabaseDesign } from '../../supabase/design';

/**
 * ### 获取素材
 * @param param0
 * @returns
 */
export const getMaterial = async ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}): Promise<Material[]> => {
  const { data, error } = await supabaseDesign(token)
    .from('material')
    .select('*')
    .eq('userId', userId);
  if (error) throw error;
  return data;
};

/**
 * ### 创建素材
 * @param param0
 * @returns
 */
export const createMaterial = async ({
  userId,
  token,
  material,
  name,
  id,
}: {
  userId: string;
  token: string;
  material: any;
  name: string;
  id: string;
}): Promise<Material> => {
  const { data, error } = await supabaseDesign(token)
    .from('material')
    .insert([{ userId, options: material, name, id }])
    .select('*');
  if (error) throw error;
  return data[0];
};

/**
 * ### 编辑素材
 * @param param0
 * @returns
 */
export const editMaterial = async ({
  userId,
  token,
  name,
  id,
}: {
  userId: string;
  token: string;
  name: string;
  id: string;
}): Promise<Material> => {
  const { data, error } = await supabaseDesign(token)
    .from('material')
    .update({ name })
    .eq('id', id)
    .eq('userId', userId)
    .select('*');
  if (error) throw error;
  return data[0];
};
