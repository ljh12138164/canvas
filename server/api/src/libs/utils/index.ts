import { nanoid } from 'nanoid';

/**
 * ## 生成邀请码
 * @param size 邀请码长度
 * @returns
 */
export function generateInviteCode(size = 10) {
  const chars = nanoid(size);
  return chars;
}
