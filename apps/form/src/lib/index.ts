import { useToast } from '@/components/ui/toast';
import { getCurrentUser } from '@/database/supabase/user';
import type { Updater } from '@tanstack/vue-query';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import type { Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import useUser from '../stores/user';

export const DEFAULT_AVATAR =
  'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/ASSETS/avatar.svg';
export const USER_IMAGE_URL = 'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/';

const { toast: UiToast } = useToast();
class Toast {
  success(message: string) {
    UiToast({
      title: message,
      variant: 'default',
    });
  }
  error(message: string) {
    UiToast({
      title: message,
      variant: 'destructive',
    });
  }
  info(message: string) {
    UiToast({
      title: message,
      variant: 'default',
    });
  }
}

export const toast = new Toast();

/**
 * 检查用户是否登录
 * @returns
 */
export const checkUserLogin = async () => {
  const user = await getCurrentUser();

  return user;
};

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
  redirect = true,
) {
  try {
    const data = await getCurrentUser();
    const { setUserData } = useUser();

    if (!data) {
      // 用户未登录，只在非登录页时重定向到登录页
      if (to.path !== '/auth' && redirect) {
        return next('/auth');
      }
    } else {
      // 用户已登录
      if (data) {
        // @ts-ignore
        setUserData(data);
      }
      // 已登录用户访问登录页时重定向到首页
      if (to.path === '/auth' && redirect) {
        return next('/');
      }
    }
    // 其他情况直接放行
    return next();
  } catch (error) {
    if (to.path !== '/auth' && redirect) {
      return next('/auth');
    }
    return next();
  }
}
// @ts-ignore
export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue;
}

localforage.config({
  name: 'ljh-form',
  storeName: 'ljh-form',
});

interface IndexDBChanagePros {
  type: 'add' | 'delete' | 'edit';
  data?: {
    id: string;
    schema: string;
  };
  deletItem?: string;
  editData?: {
    id: string;
    schema: string;
  };
}
/**
 * 更新indexDB
 * @param type 类型
 * @param data 数据
 * @param deletItem 删除的id
 * @param editData 编辑的数据
 * @returns
 */
export function indexDBChange({ type, data, deletItem, editData }: IndexDBChanagePros) {
  if (type === 'delete' && deletItem) {
    return localforage.removeItem(deletItem);
  }
  if (type === 'add' && data) {
    return localforage.setItem(data.id, data);
  }
  if (type === 'edit' && editData) {
    localforage.removeItem(editData.id);
    return localforage.setItem(editData.id, editData);
  }
}
/**
 * 获取indexDB数据
 * @returns 数据
 */
export async function getIndexDB() {
  const arr: { id: string; schema: string }[] = [];
  await localforage.iterate((res: { id: string; schema: string }) => {
    arr.push(res);
  });
  return arr;
}
/**
 * 获取指定id的数据
 * @param id 数据id
 * @returns 数据
 */
export async function getFormDataById(id: string) {
  return await localforage.getItem<{ id: string; schema: string }>(id);
}

/**
 * ### 下载文件
 * @param string 链接
 */
export function downLoad(link: string, type: string) {
  const a: HTMLAnchorElement = document.createElement('a');
  a.href = link;
  a.download = `${nanoid()}.${type}`;
  a.target = '_blank';
  a.click();
  a.remove();
}
