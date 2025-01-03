import { useToast } from '@/components/ui/toast'
import { getCurrentUser } from '@/server/supabase/user'
import type { RouteLocationNormalized } from 'vue-router'
import useUser from '@/stores/user'

export const DEFAULT_AVATAR =
  'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/ASSETS/avatar.svg'
export const USER_IMAGE_URL = 'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/'

const { toast: UiToast } = useToast()
class Toast {
  success(message: string) {
    UiToast({
      title: message,
      variant: 'default',
    })
  }
  error(message: string) {
    UiToast({
      title: message,
      variant: 'destructive',
    })
  }
  info(message: string) {
    UiToast({
      title: message,
      variant: 'default',
    })
  }
}

export const toast = new Toast()

/**
 * 检查用户是否登录
 * @returns
 */
export const checkUserLogin = async () => {
  const user = await getCurrentUser()

  return user
}

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
    const data = await getCurrentUser()
    const { setUserData } = useUser()

    if (!data) {
      // 用户未登录，只在非登录页时重定向到登录页
      if (to.path !== '/auth') {
        return next('/auth')
      }
    } else {
      // 用户已登录
      if (data) {
        setUserData(data)
      }
      // 已登录用户访问登录页时重定向到首页
      if (to.path === '/auth') {
        return next('/')
      }
    }
    // 其他情况直接放行
    return next()
  } catch (error) {
    console.error('routerCheckLogin error:', error)
    if (to.path !== '/auth') {
      return next('/auth')
    }
    return next()
  }
}
