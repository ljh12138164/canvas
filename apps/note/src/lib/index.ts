import { getCurrentUser } from "@/server/supabase/user";
import useUser from "@/store/user";
import type { Sessions } from "@/types/user";
import type { RouteLocationNormalized } from "vue-router";
import {
  type ToastPosition,
  type ToastTheme,
  type ToastTransition,
  toast as toastify,
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
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: (go?: string) => void
) {
  try {
    const data = await getCurrentUser();
    const { setUserData } = useUser();

    if (!data) {
      // 用户未登录，只在非登录页时重定向到登录页
      if (to.path !== "/login") {
        return next("/login");
      }
    } else {
      // 用户已登录
      if (data?.session) {
        setUserData({ session: data?.session as Sessions });
      }
      // 已登录用户访问登录页时重定向到首页
      if (to.path === "/login") {
        return next("/");
      }
    }
    // 其他情况直接放行
    return next();
  } catch (error) {
    console.error("routerCheckLogin error:", error);
    if (to.path !== "/login") {
      return next("/login");
    }
    return next();
  }
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  a.remove();
}

/**
 * 随机颜色
 */
export function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
// 高亮色调增强
export const HIGHLIGHT_COLORS = [
  "#F59E0B",
  "#EF4444",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#D97706",
  "#EC4899",
  "#6366F1",
  "#22C55E",
  "#F97316",
  "#E11D48",
  "#2563EB",
  "#14B8A6",
  "#7C3AED",
  "#F43F5E",
  "#0EA5E9",
  "#6D28D9",
  "#047857",
  "#D946EF",
  "#0891B2",
];
