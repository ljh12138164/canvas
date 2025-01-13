import { getCurrentUser } from '@/server/supabase/user';
/**
 * @param 获取新 acc_token
 */
export const getNewToken = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return user.session.access_token;
};
