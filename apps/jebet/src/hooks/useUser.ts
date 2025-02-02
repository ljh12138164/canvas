import useStore from '@/store/user';
import type { Profiles } from '@/types/user';
import { to } from 'await-to-js';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../server/supabase/user';
/**
 * ## 获取用户信息
 */
export const useUser = ({ redirect, type }: { redirect: boolean; type: 'sign' | 'board' }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<Profiles | null>(null);
  useEffect(() => {
    (async () => {
      const [error, data] = await to(getCurrentUser());
      if (type === 'sign') {
        if (error || !data) {
          return setIsLoading(false);
        }
        toast.success('用户已登录');
        navigate('/dashboard');
      }
      if (type === 'board') {
        if (error || !data) {
          setIsLoading(false);
          if (redirect) return navigate('/sign-in');
          return;
        }
        useStore.setUserData(data.user.user_metadata as Profiles);

        setUser(data.user.user_metadata as Profiles);
        setIsSignedIn(true);
        setIsLoading(false);
      }
    })();
  }, []);
  return { isLoading, user, isSignedIn };
};
