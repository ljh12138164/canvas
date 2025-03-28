import type { Collections, Show, Upvote } from '../../../types/design/show';
import type { Profiles } from '../../../types/note/workspace';
import {
  supabaseDesign,
  supabaseDesignPublic,
  supabaseServiceDesign,
} from '../../supabase/design/index';

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
  region,
}: {
  token: string;
  id: string;
  name: string | undefined;
  image: string | undefined;
  region: string | undefined;
}) => {
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
  if (region) {
    const { data, error } = await supabaseDesign(token)
      .from('profiles')
      .update([
        {
          region,
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

/**
 * ### 获取用户发送的帖子
 * @param userId 要查询的用户ID
 * @param search 搜索关键词
 * @returns
 */
export const getUserPosts = async ({
  userId,
  search,
}: {
  userId: string;
  search: string;
}): Promise<(Show & { profiles: Profiles })[]> => {
  let supabase = supabaseDesignPublic
    .from('show')
    .select('*, profiles(*)')
    .eq('userId', userId)
    .order('created_at', { ascending: false });

  if (search) supabase = supabase.like('title', `%${search}%`);

  const { data, error } = await supabase;
  if (error) throw new Error('服务器错误');
  return data;
};

/**
 * ### 获取其他用户点赞的帖子
 * @param userId 要查询的用户ID
 * @param search 搜索关键词
 * @returns
 */
export const getUserLikeByOther = async ({
  userId,
  search,
}: {
  userId: string;
  search: string;
}): Promise<(Upvote & { show: Show & { profiles: Profiles } })[]> => {
  let supabase = supabaseDesignPublic
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
 * ### 获取其他用户收藏的帖子
 * @param userId 要查询的用户ID
 * @param search 搜索关键词
 * @returns
 */
export const getUserCollectByOther = async ({
  userId,
  search,
}: {
  userId: string;
  search: string;
}): Promise<(Collections & { show: Show & { profiles: Profiles } })[]> => {
  let supabase = supabaseDesignPublic
    .from('collections')
    .select('*,show(*,profiles(*))')
    .eq('userId', userId);

  if (search) supabase = supabase.like('show.title', `%${search}%`);

  const { data, error } = await supabase.order('created_at', { ascending: false });
  if (error) throw new Error('服务器错误');
  return data.filter((item) => item.show !== null);
};

/**
 * ### 获取用户完整个人资料（包含发帖、点赞、收藏）
 * @param userId 要查询的用户ID
 * @returns
 */
export const getUserProfile = async ({
  userId,
}: {
  userId: string;
}): Promise<{
  userInfo: Profiles | null;
  posts: (Show & { profiles: Profiles })[];
  likes: (Upvote & { show: Show & { profiles: Profiles } })[];
  collections: (Collections & { show: Show & { profiles: Profiles } })[];
}> => {
  const [userInfoResult, postsResult, likesResult, collectionsResult] = await Promise.all([
    // 获取用户基本信息
    supabaseDesignPublic
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(),

    // 获取用户发帖
    supabaseDesignPublic
      .from('show')
      .select('*, profiles(*)')
      .eq('userId', userId)
      .order('created_at', { ascending: false })
      .limit(10),

    // 获取用户点赞
    supabaseDesignPublic
      .from('upvotes')
      .select('*,show(*,profiles(*))')
      .eq('userId', userId)
      .order('created_at', { ascending: false })
      .limit(10),

    // 获取用户收藏
    supabaseDesignPublic
      .from('collections')
      .select('*,show(*,profiles(*))')
      .eq('userId', userId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  // 检查错误
  if (userInfoResult.error && userInfoResult.error.code !== 'PGRST116')
    throw new Error('获取用户信息错误');
  if (postsResult.error) throw new Error('获取用户发帖错误');
  if (likesResult.error) throw new Error('获取用户点赞错误');
  if (collectionsResult.error) throw new Error('获取用户收藏错误');

  return {
    userInfo: userInfoResult.data,
    posts: postsResult.data,
    likes: likesResult.data.filter((item) => item.show !== null),
    collections: collectionsResult.data.filter((item) => item.show !== null),
  };
};
