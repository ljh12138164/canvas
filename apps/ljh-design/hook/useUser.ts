import { getCurrentUser } from '@/server/user';
import { useUser } from '@/store/auth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * 检查用户信息
 * @returns
 */
const useUsers = ({ redirects = true }: { redirects?: boolean }) => {
  const { user, loading, setUser, setLoading } = useUser();
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        if (redirects) {
          toast.error('请先登录');
          redirect('/sign-in');
        }
      } else {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);
  return { user, loading };
};

export default useUsers;
