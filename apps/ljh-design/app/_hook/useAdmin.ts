'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jwtDecode } from '../_database/user/admin';

export const useIsAdmin = ({ type }: { type: 'login' | 'logout' }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('ljh-admin-token');
    toast.dismiss();
    // 检测token是否存在
    if (type === 'login') {
      if (!token) {
        setLoading(false);
      } else {
        // 检测token是否过期
        jwtDecode(token)
          // 未过期
          .then(() => {
            toast.success('已登录');
            router.push('/admin');
            setLoading(false);
          })
          // 解码失败
          .catch(() => {
            localStorage.removeItem('ljh-admin-token');
            setLoading(false);
          });
      }
      return;
    }
    // 检测token是否存在
    if (!token) {
      setLoading(false);
      router.push('/admin/login');
      return;
    }
    jwtDecode(token)
      .then(() => {
        setLoading(false);
      })
      // 解码失败
      .catch(() => {
        // localStorage.removeItem('ljh-admin-token');
        router.push('/admin/login');
      });
  }, [type]);
  return { isLoading };
};
