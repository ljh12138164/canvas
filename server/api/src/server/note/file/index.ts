import to from 'await-to-js';
import { supabaseNote } from '../../../server/supabase/note/index';
import { checkPermission } from '../workspace';
import { Filts } from '../../../types/note/workspace';

export const createFile = async ({
  token,
  title,
  inconId,
  workspaceId,
  content,
  userId,
  folderId,
}: {
  token: string;
  title: string;
  inconId: string;
  workspaceId: string;
  content: string;
  userId: string;
  folderId: string;
}): Promise<Filts> => {
  const [fetcherror, result] = await to(
    checkPermission({ token, workspaceId, userId })
  );
  if (fetcherror?.message === '工作区不存在') throw new Error('工作区不存在');
  if (!result) throw new Error('无权限');
  const { data, error } = await supabaseNote(token)
    .from('files')
    .insert({ title, inconId, workspaceId, data: content, foldId: folderId })
    .select('*');
  if (error) throw new Error('服务器错误');
  return data[0];
};
