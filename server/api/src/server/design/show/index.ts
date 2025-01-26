import type { Collections, Comment, Show, Upvote } from '../../../types/design/show';
import type { Profiles } from '../../../types/note/workspace';
import { supabaseDesign, supabaseDesignPublic } from '../../supabase/design';
const LIMIT = 10;

// id: string;
// title: string;
// userId: string;
// created_at: string;
// updated_at?: string;
// explanation: string;
// relativeTheme: string;
// tags: string[];
// image: string;
// json: string;
/**
 * ### 创建评论
 */
export const createShow = async ({
  title,
  content,
  tap,
  userId,
  json,
  relativeTheme,
  token,
  image,
  width,
  height,
}: {
  title: string;
  content: string;
  tap: string;
  userId: string;
  json: string;
  image: string;
  width: number;
  height: number;
  relativeTheme: string;
  token: string;
}): Promise<Show> => {
  const { data, error } = await supabaseDesign(token)
    .from('show')
    .insert([
      {
        explanation: content,
        userId,
        json,
        relativeTheme,
        tags: tap,
        title,
        image,
        width,
        height,
      },
    ])
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ### 获取随机展示分页
 * @param tap 标签
 * @param page 页码
 * @returns
 */
export const getRandomShow = async ({
  tap,
  page,
}: {
  tap: string;
  page: number;
}): Promise<{
  data: (Show & { profiles: Profiles; answers: Comment[]; upvotes: Upvote[] })[];
  count: number;
}> => {
  let supabase = supabaseDesignPublic.from('show').select('*,answers(*),profiles(*),upvotes(*)', {
    count: 'exact',
  });
  // 模糊查询
  if (tap) supabase = supabase.like('tags', `%${tap}%`).like('title', `%${tap}%`);

  // 随机获取10条
  const { data, error, count } = await supabase
    .order('created_at', { ascending: false })
    .limit(LIMIT)
    .range((page - 1) * LIMIT, page * LIMIT);
  if (error) throw new Error('服务器错误');
  return { data, count: count ?? 0 };
};

/**
 * ### 获取展示
 * @param show
 * @returns
 */
export const getShow = async (
  id: string,
  userId?: string,
  token?: string,
): Promise<
  Show & {
    profiles: Profiles;
    answers: Comment & { profiles: Profiles }[];
    upvotes: null;
    collections: null;
    isUpvote: boolean;
    isCollect: boolean;
  }
> => {
  if (userId && token) {
    const { data, error } = await supabaseDesign(token)
      .from('show')
      .select('*,answers(*,profiles(*)),profiles(*),upvotes(*),collections(*)')
      .eq('id', id);
    if (error) throw new Error('服务器错误');
    // 判断是否收藏和点赞
    return data.map((item) => ({
      ...item,
      upvotes: null,
      collections: null,
      isCollect:
        item.collections.filter((collection: Collections) => collection.userId === userId).length >
        0,
      isUpvote: item.upvotes.filter((upvote: Upvote) => upvote.userId === userId).length > 0,
    }))[0];
  }
  const { data, error } = await supabaseDesignPublic
    .from('show')
    .select('*,answers(*),profiles(*),upvotes(*)')
    .eq('id', id);
  if (error) throw new Error('服务器错误');
  return data[0];
};
