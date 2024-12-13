import { useToast } from '@/components/ui/toast/use-toast';
import { getCurrentUser } from '~/database/supabase/user';
export const DEFAULT_AVATAR =
  'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/ASSETS/avatar.svg';
export const USER_IMAGE_URL =
  'https://spvppoqewfwqyzlsmtru.supabase.co/storage/v1/object/public/';

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
