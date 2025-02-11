'use client';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { useAdmin } from '@/app/_hook/query/useAdmin';
import { useIsAdmin } from '@/app/_hook/useAdmin';
import { zodResolver } from '@hookform/resolvers/zod';
import { MD5 } from 'crypto-js';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(2, '用户名长度至少为2位'),
  password: z.string().min(6, '密码长度至少为6位').max(16, '密码长度最多为16位'),
});
const Login = () => {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { isLoading } = useIsAdmin({ type: 'login' });
  const router = useRouter();
  const { mutate, isPending } = useAdmin();
  const onSubmit = async (data: z.infer<typeof schema>) => {
    const hash = MD5(data.password).toString();
    mutate(
      { json: { ...data, password: hash } },
      {
        onSuccess: (data) => {
          if (data.token) {
            localStorage.setItem('ljh-admin-token', data.token);
            router.push('/admin');
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };
  if (isLoading) return <></>;
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">管理员登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input id="username" placeholder="请输入用户名" {...register('username')} />
              {formState.errors.username && (
                <p className="text-red-500 text-sm">{formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                {...register('password')}
              />
              {formState.errors.password && (
                <p className="text-red-500 text-sm">{formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
