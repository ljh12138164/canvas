import { getLocalToken, jwtDecode } from '@/lib/sign';
import { getCurrentUser } from '@/server/user';
import { useUser } from '@/store/auth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * 检查用户信息
 * @returns
 */
const useUsers = () => {
  const { user, loading, setUser } = useUser();
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        toast.error('请先登录');
        redirect('/board/sign-in');
      }
      setUser(user);
    })();
  }, []);
  return { user, loading };
};

export default useUsers;
