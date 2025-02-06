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
