import { useToast } from '@/components/ui/toast';
import { getCurrentUser } from '@/server/supabase/user';
import useUser from '@/store/user';
import type { Sessions } from '@/types/user';
import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
// import {
//   type ToastPosition,
//   type ToastTheme,
//   type ToastTransition,
//   toast as toastify,
// } from 'vue3-toastify';

export const DEFAULT_AVATAR =
  'https://dtdgcdckrehydymmxhng.supabase.co/storage/v1/object/public/USER_IMAGE/avatar.svg';
export const USER_IMAGE_URL = 'https://dtdgcdckrehydymmxhng.supabase.co/storage/v1/object/public/';
// toast 实例
const toastInstance = useToast();
const { toast: toastClass } = toastInstance;
class Toast {
  // 使用 useToast 创建 toast 实例
  success(message: string) {
    toastClass({ title: message });
  }
  error(message: string) {
    toastClass({ title: message });
  }
  warning(message: string) {
    toastClass({ title: message });
  }
  loading(message: string) {
    toastClass({ title: message });
  }
  dismiss() {
    toastInstance.dismiss();
  }
}
export const toast = new Toast();

/**
 * 检查是否登录
 * @param _
 * @param __
 * @param next
 */
export async function routerCheckLogin(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: (go?: string) => void,
) {
  try {
    const data = await getCurrentUser();
    const { setUserData } = useUser();

    if (!data) {
      // 用户未登录，只在非登录页时重定向到登录页
      if (to.path !== '/login') return next('/login');
    } else {
      // 用户已登录
      if (data?.session) {
        setUserData({ session: (data as Sessions).session });
      }
      // 已登录用户访问登录页时重定向到首页
      if (to.path === '/login') return next('/');
    }
    // 其他情况直接放行
    return next();
  } catch (error) {
    console.error('routerCheckLogin error:', error);
    if (to.path !== '/login') {
      return next('/login');
    }
    return next();
  }
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  a.remove();
}

/**
 * 随机颜色
 */
export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
// 高亮色调增强
export const HIGHLIGHT_COLORS = [
  '#F59E0B',
  '#EF4444',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#D97706',
  '#EC4899',
  '#6366F1',
  '#22C55E',
  '#F97316',
  '#E11D48',
  '#2563EB',
  '#14B8A6',
  '#7C3AED',
  '#F43F5E',
  '#0EA5E9',
  '#6D28D9',
  '#047857',
  '#D946EF',
  '#0891B2',
];

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue;
}

export const LOGO_URL =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/ohter/note/logo.webp';
export const LOGO_IMAGE_URL =
  'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/ohter/note/logoImage.webp';
