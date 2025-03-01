import type { Collections, Show, Upvote } from '../../../types/design/show';
import type { Profiles } from '../../../types/note/workspace';
import { supabaseDesign, supabaseServiceDesign } from '../../supabase/design/index';

/**
 * ### 更新用户信息
 * @param token
 * @param id
 * @param name
 * @param image
 * @returns
 */
export const updateUser = async ({
  token,
  id,
  name,
  image,
}: { token: string; id: string; name: string | undefined; image: string | undefined }) => {
  if (name) {
    const { data, error } = await supabaseDesign(token)
      .from('profiles')
      .update([
        {
          name: name,
        },
      ])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data;
  }
  if (image) {
    const { data, error } = await supabaseDesign(token)
      .from('profiles')
      .update([{ image: image }])
      .eq('id', id)
      .select('*');
    if (error) throw new Error('服务器错误');
    return data;
  }
};

/**
 * ### 更新用户密码
 * @param token
 * @param password
 * @returns
 */
export const updatePassword = async ({
  password,
  userId,
}: { password: string; userId: string }) => {
  const { data, error } = await supabaseServiceDesign.auth.admin.updateUserById(userId, {
    password,
  });
  if (error) throw Error(error.message);
  return data;
};

/**
 * ### 获取用户点赞
 * @param token
 * @param userId
 * @returns
 */
export const getUserLike = async ({
  token,
  userId,
  search,
}: {
  token: string;
  userId: string;
  search: string;
}): Promise<(Upvote & { show: Show & { profiles: Profiles } })[]> => {
  let supabase = supabaseDesign(token)
    .from('upvotes')
    .select('*,show(*,profiles(*))')
    .eq('userId', userId)
    .order('created_at', { ascending: false });
  if (search) supabase = supabase.like('show.title', `%${search}%`);
  const { data, error } = await supabase;
  if (error) throw new Error('服务器错误');
  return data.filter((item) => item.show !== null);
};

/**
 * ### 获取用户的收藏
 * @param token
 * @param userId
 * @returns
 */
export const getUserCollect = async ({
  token,
  userId,
  search,
}: {
  token: string;
  userId: string;
  search: string;
}): Promise<(Collections & { show: Show & { profiles: Profiles } })[]> => {
  let supabase = supabaseDesign(token)
    .from('collections')
    .select('*,show(*,profiles(*))')
    .eq('userId', userId);

  if (search) supabase = supabase.like('show.title', `%${search}%`);

  const { data, error } = await supabase.order('created_at', { ascending: false });
  if (error) throw new Error('服务器错误');
  return data.filter((item) => item.show !== null);
};

/**
 * ### 获取用户的所有数据进行统计和图标显示
 * @param param0
 * @returns
 */
export const getUserData = async ({
  token,
  userId,
  startTime,
  endTime,
}: {
  token: string;
  userId: string;
  startTime?: Date;
  endTime?: Date;
}) => {
  const { data, error } = await supabaseDesign(token)
    .from('profiles')
    .select(
      '*,show(type,clone,title,created_at,upvotes(*),collections(*)),upvotes(*),collections(*),material(created_at,id),board(id,isTemplate,created_at)',
    )
    .eq('id', userId);
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('用户不存在');
  //
  const userData = data[0] as Profiles & {
    show: {
      id: string;
      type: 'template' | 'material';
      clone: boolean;
      title: string;
      created_at: Date;
      upvotes: { id: string; created_at: Date }[];
      collections: { id: string; created_at: Date }[];
    }[];
    upvotes: { id: string; created_at: Date }[];
    collections: { id: string; created_at: Date }[];
    material: { id: string; created_at: Date }[];
    board: { id: string; isTemplate: boolean; created_at: Date }[];
  };
  // 过滤
  if (startTime) {
    //
    userData.show = userData.show.filter(
      (item) => new Date(item.created_at).getTime() >= startTime.getTime(),
    );
    userData.upvotes = userData.upvotes.filter(
      (item) => new Date(item.created_at).getTime() >= startTime.getTime(),
    );
    userData.collections = userData.collections.filter(
      (item) => new Date(item.created_at).getTime() >= startTime.getTime(),
    );
    userData.material = userData.material.filter(
      (item) => new Date(item.created_at).getTime() >= startTime.getTime(),
    );
    userData.board = userData.board.filter(
      (item) => new Date(item.created_at).getTime() >= startTime.getTime(),
    );
  }
  if (endTime) {
    userData.show = userData.show.filter(
      (item) => new Date(item.created_at).getTime() <= endTime.getTime(),
    );
    userData.upvotes = userData.upvotes.filter(
      (item) => new Date(item.created_at).getTime() <= endTime.getTime(),
    );
    userData.collections = userData.collections.filter(
      (item) => new Date(item.created_at).getTime() <= endTime.getTime(),
    );
    userData.material = userData.material.filter(
      (item) => new Date(item.created_at).getTime() <= endTime.getTime(),
    );
    userData.board = userData.board.filter(
      (item) => new Date(item.created_at).getTime() <= endTime.getTime(),
    );
  }
  return userData;
};
