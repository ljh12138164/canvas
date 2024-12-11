import { useToast } from '@/components/ui/toast/use-toast';
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
