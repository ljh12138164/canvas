import { getCurrentUser } from "@/server/supabase/user";
import useUser from "@/store/user";
import { RouteLocationNormalized } from "vue-router";
import {
  toast as toastify,
  ToastPosition,
  ToastTheme,
  ToastTransition,
} from "vue3-toastify";

export const DEFAULT_AVATAR =
  "https://dtdgcdckrehydymmxhng.supabase.co/storage/v1/object/public/USER_IMAGE/avatar.svg";
export const USER_IMAGE_URL =
  "https://dtdgcdckrehydymmxhng.supabase.co/storage/v1/object/public/";
// toast 实例
const toastOption = {
  theme: "auto" as ToastTheme,
  position: "top-center" as ToastPosition,
  transition: "flip" as ToastTransition,
  dangerouslyHTMLString: true,
  hideProgressBar: true,
};
class Toast {
  // 使用 useToast 创建 toast 实例
  success(message: string) {
    toastify.success(message, toastOption);
  }
  error(message: string) {
    toastify.error(message, toastOption);
  }
  warning(message: string) {
    toastify.warning(message, toastOption);
  }
  loading(message: string) {
    toastify.loading(message, toastOption);
  }
  dismiss() {
    toastify.clearAll();
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
  _: RouteLocationNormalized,
  __: RouteLocationNormalized,
  next: (go?: string) => void
) {
  const data = await getCurrentUser();
  const { setUserData } = useUser();

  if (!data) {
    next("/login");
  } else {
    setUserData({ session: data.session });
    next();
  }
}

/**
 * 登录界面登录后
 * @param _
 * @param __
 * @param next
 */
export async function routerLoginAfter(
  _: RouteLocationNormalized,
  __: RouteLocationNormalized,
  next: (go?: string) => void
) {
  const data = await getCurrentUser();
  if (data) {
    toast.success("用户已登录");
    next("/");
  } else {
    next();
  }
}
