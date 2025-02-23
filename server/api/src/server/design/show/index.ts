import type { Board } from '../../../types/design/board';
import type { Collections, Comment, Show, Upvote } from '../../../types/design/show';
import type { Material } from '../../../types/design/template';
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
  relativeTheme,
  type,
  relativeMaterial,
  token,
}: {
  title: string;
  content: string;
  tap: string;
  userId: string;
  token: string;
  relativeTheme: string | undefined;
  type: 'template' | 'material';
  relativeMaterial: string | undefined;
}): Promise<Show> => {
  if (type === 'template') {
    if (!relativeTheme) throw new Error('主题不能为空');
    const { data, error } = await supabaseDesign(token)
      .from('show')
      .insert([
        {
          explanation: content,
          userId,
          relativeTheme,
          tags: tap,
          title,
          type,
        },
      ])
      .select('*');

    if (error) throw new Error('服务器错误');
    return data[0];
  }
  if (type === 'material') {
    if (!relativeMaterial) throw new Error('素材不能为空');
    const { data, error } = await supabaseDesign(token)
      .from('show')
      .insert([{ title, explanation: content, userId, relativeMaterial, tags: tap, type }])
      .select('*');
    if (error) throw new Error('服务器错误');
    return data[0];
  }
  throw new Error('类型错误');
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
  data: (Show & {
    profiles: Profiles;
    answers: Comment[];
    upvotes: Upvote[];
    board: Board;
    material: Material;
  })[];
  count: number;
}> => {
  let supabase = supabaseDesignPublic
    .from('show')
    .select('*,answers(*),profiles(*),upvotes(*),board(*),material(*)', {
      count: 'exact',
    });
  // 模糊查询
  if (tap) supabase = supabase.or(`tags.like.%${tap}%,title.like.%${tap}%`);

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
    board: Board;
    upvotes: null;
    collections: null;
    isUpvote: boolean;
    isCollect: boolean;
    material: Material;
  }
> => {
  if (userId && token) {
    const { data, error } = await supabaseDesign(token)
      .from('show')
      .select('*,answers(*,profiles(*)),profiles(*),upvotes(*),collections(*),board(*),material(*)')
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
    .select('*,answers(*),profiles(*),upvotes(*),board(*),material(*)')
    .eq('id', id);
  if (error) throw new Error('服务器错误');
  return data[0];
};

/**
 * ### 获取seo
 * @param id
 * @returns
 */
export const getSeo = async (): Promise<{ id: string }[]> => {
  const { data, error } = await supabaseDesignPublic.from('show').select('id');
  if (error) throw new Error('服务器错误');
  return data;
};
