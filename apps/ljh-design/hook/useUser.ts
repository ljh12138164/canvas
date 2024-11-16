import { getLocalToken, jwtDecode } from '@/lib/sign';
import { authStore } from '@/store/auth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * 检查用户信息
 * @returns
 */
const useUser = () => {
  const { userId, isLoading } = authStore();
  useEffect(() => {
    (async () => {
      const token = await getLocalToken();
      if (!token) {
        toast.error('请先登录');
        redirect('/board/sign-in');
      }
      const user = await jwtDecode(token);
      if (!user) {
        toast.error('请先登录');
        redirect('/board/sign-in');
      }
      authStore.setState({ userId: user.userid, isLoading: false });
    })();
  }, []);
  return { userId, isLoading };
};

export default useUser;
