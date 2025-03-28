import type { Ai } from '../../../types/design/ai';
import type { Board } from '../../../types/design/board';
import type { Collections, Show } from '../../../types/design/show';
import type { Material } from '../../../types/design/template';
import type { User } from '../../../types/design/user';
import type { Profiles } from '../../../types/note/workspace';
import { supabaseDesignPublic } from '../../supabase/design';

export const validateAdmin = async (accounte: string, password: string) => {
  const { data, error } = await supabaseDesignPublic
    .from('admin')
    .select('*')
    .eq('accounte', accounte)
    .eq('password', password);
  if (error) throw new Error('服务器错误');
  if (data.length === 0) throw new Error('用户名或密码错误');
  return !!data.length;
};

const filterDate = <T extends { created_at: string }>(
  data: T[],
  startDate: Date | undefined,
  endDate: Date | undefined,
) => {
  if (!startDate && !endDate) return data;
  if (startDate && !endDate)
    return data.filter((item) => new Date(item.created_at).getTime() >= startDate.getTime());
  if (!startDate && endDate)
    return data.filter((item) => new Date(item.created_at).getTime() <= endDate.getTime());
  if (startDate && endDate)
    return data.filter((item) => {
      return (
        new Date(item.created_at).getTime() >= startDate.getTime() &&
        new Date(item.created_at).getTime() <= endDate.getTime()
      );
    });
  return [];
};

/**
 * ### 获取话题统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 话题列表
 */
export const getShowList = async (startDate: Date | undefined, endDate: Date | undefined) => {
  const { data, error } = await supabaseDesignPublic.from('show').select('*,profiles(*)');
  if (error) throw new Error('服务器错误');
  return filterDate<Show & { profiles: Profiles }>(data, startDate, endDate);
};

/**
 * ### 获取作品统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 作品列表
 */
export const getBoardList = async (startDate: Date | undefined, endDate: Date | undefined) => {
  const { data, error } = await supabaseDesignPublic
    .from('board')
    .select('*,profiles(*)')
    .eq('isTemplate', false);
  if (error) throw new Error('服务器错误');
  return filterDate<Board & { profiles: Profiles }>(data, startDate, endDate);
};

/**
 * ### 获取素材统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 素材列表
 */
export const getMaterialList = async (startDate: Date | undefined, endDate: Date | undefined) => {
  const { data, error } = await supabaseDesignPublic.from('material').select('*,profiles(*)');
  if (error) throw new Error('服务器错误');
  return filterDate<Material & { profiles: Profiles }>(data, startDate, endDate);
};

/**
 * ### 获取点赞统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 点赞列表
 */
export const getUpvotesList = async (startDate: Date | undefined, endDate: Date | undefined) => {
  const { data, error } = await supabaseDesignPublic.from('upvotes').select('*,profiles(*)');
  if (error) throw new Error('服务器错误');
  return filterDate<Collections & { profiles: Profiles }>(data, startDate, endDate);
};

/**
 * ### 获取收藏统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 收藏列表
 */
export const getCollectionsList = async (
  startDate: Date | undefined,
  endDate: Date | undefined,
) => {
  const { data, error } = await supabaseDesignPublic.from('collections').select('*,profiles(*)');
  if (error) throw new Error('服务器错误');
  return filterDate<Collections & { profiles: Profiles }>(data, startDate, endDate);
};

/**
 * ### 获取用户统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 用户列表
 */
export const getUserList = async (startDate: Date | undefined, endDate: Date | undefined) => {
  const { data, error } = await supabaseDesignPublic.from('profiles').select('*');
  if (error) throw new Error('服务器错误');
  return filterDate<User>(data, startDate, endDate);
};

/**
 * ### 获取用户数据统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 用户数据列表
 */
export const getUserDataList = async (startDate: Date | undefined, endDate: Date | undefined) => {
  const { data, error } = await supabaseDesignPublic
    .from('board')
    .select('*,profiles(*)')
    .eq('isTemplate', true);
  if (error) throw new Error('服务器错误');
  return filterDate<Board & { profiles: Profiles }>(data, startDate, endDate);
};

/**
 * ### 获取AI统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns AI列表
 */
export const getAiList = async (startDate: Date | undefined, endDate: Date | undefined) => {
  const { data, error } = await supabaseDesignPublic.from('ai').select('*,profiles(*)');
  if (error) throw new Error('服务器错误');
  return filterDate<Ai & { profiles: Profiles }>(data, startDate, endDate);
};

/**
 * ### 获取仪表盘统计
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 仪表盘列表
 */
export const getDashboardList = async (
  startDate: Date | undefined,
  endDate: Date | undefined,
  code: number | undefined,
) => {
  let supbases = supabaseDesignPublic
    .from('profiles')
    .select(
      '*,show(created_at,id,upvotes(created_at,id),collections(created_at,id)),upvotes(created_at,id),collections(created_at,id),material(created_at,id),board(created_at,id)',
    );
  // .like('region', `%${code}%`);
  if (code) supbases = supbases.like('region', `%${code}%`);
  const { data, error } = await supbases;
  if (error) throw new Error('服务器错误');
  const sumData = data as (Profiles & {
    show: Show[];
    upvotes: { id: string; created_at: Date }[];
    collections: { id: string; created_at: Date }[];
    material: { id: string; created_at: Date }[];
    board: { id: string; isTemplate: boolean; created_at: Date }[];
  })[];
  const filterData = sumData?.map((userData) => {
    // 过滤
    if (startDate) {
      //
      userData.show = userData.show.filter(
        (item) => new Date(item.created_at).getTime() >= startDate.getTime(),
      );
      userData.upvotes = userData.upvotes.filter(
        (item) => new Date(item.created_at).getTime() >= startDate.getTime(),
      );
      userData.collections = userData.collections.filter(
        (item) => new Date(item.created_at).getTime() >= startDate.getTime(),
      );
      userData.material = userData.material.filter(
        (item) => new Date(item.created_at).getTime() >= startDate.getTime(),
      );
      userData.board = userData.board.filter(
        (item) => new Date(item.created_at).getTime() >= startDate.getTime(),
      );
    }
    if (endDate) {
      userData.show = userData.show.filter(
        (item) => new Date(item.created_at).getTime() <= endDate.getTime(),
      );
      userData.upvotes = userData.upvotes.filter(
        (item) => new Date(item.created_at).getTime() <= endDate.getTime(),
      );
      userData.collections = userData.collections.filter(
        (item) => new Date(item.created_at).getTime() <= endDate.getTime(),
      );
      userData.material = userData.material.filter(
        (item) => new Date(item.created_at).getTime() <= endDate.getTime(),
      );
      userData.board = userData.board.filter(
        (item) => new Date(item.created_at).getTime() <= endDate.getTime(),
      );
    }
    return userData;
  });

  if (error) throw new Error('服务器错误');
  return filterData;
};
