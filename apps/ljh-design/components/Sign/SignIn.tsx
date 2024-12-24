'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { login as loginServer, signup as signUpServer } from '@/server/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { z } from 'zod';
import Protect from './Protect';

const schema = z.object({
  // 设置name为可选，且可以为空字符串
  name: z
    .string()
    .min(2, '用户名长度至少为2位')
    .optional()
    .nullable()
    .or(z.literal('')),
  accoute: z.string().email({ message: '请输入正确的邮箱' }),
  password: z
    .string()
    .min(6, '密码长度至少为6位')
    .max(16, '密码长度最多为16位'),
});

const SignIn = () => {
  const [login, setLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    if (login) {
      toast.loading('登录中...');
      loginServer({
        email: data.accoute,
        password: data.password,
      })
        .then(() => {
          toast.dismiss();
          toast.success('登录成功');
          router.push('/board');
        })
        .catch((err) => {
          toast.dismiss();
          toast.error(err.message);
        });
    } else {
      if (data.name) {
        toast.loading('注册中...');
        signUpServer({
          email: data.accoute,
          password: data.password,
          username: data.name,
        })
          .then(() => {
            toast.dismiss();
            toast.success('前往邮箱查看');
          })
          .catch((err) => {
            toast.dismiss();
            toast.error(err.message);
          });
      } else {
        setError('name', { message: '用户名不能为空' });
      }
    }
    setLoading(false);
  };
  return (
    <Protect>
      <Card className='w-full h-full p-8'>
        <CardHeader className='px-0 pt-0'>
          <CardTitle className='text-2xl font-bold'>
            {login ? '登录' : '注册'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-5 px-0 pb-0'>
          <section className='space-y-2.5 mt-6 flex flex-col gap-y-2.5'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-y-4'
            >
              <div className={`${login ? 'hidden' : 'block'}`}>
                <Input
                  {...register('name')}
                  placeholder='用户名'
                  className={`${formState.errors.name && 'border-red-500'}`}
                />
                {formState.errors.name && (
                  <span className='text-red-500 text-sm'>
                    {formState.errors.name.message}
                  </span>
                )}
              </div>
              <div>
                <Input
                  {...register('accoute')}
                  placeholder='请输入邮箱'
                  className={`${formState.errors.accoute && 'border-red-500'}`}
                />
                {formState.errors?.accoute && (
                  <span className='text-red-500 text-sm'>
                    {formState.errors?.accoute.message}
                  </span>
                )}
              </div>
              <div className=' relative'>
                {showPassword ? (
                  <BsEye
                    onClick={() => setShowPassword((show) => !show)}
                    size={18}
                    className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2  rounded-md hover:text-blue-500 transition-colors duration-300  '
                  />
                ) : (
                  <BsEyeSlash
                    onClick={() => setShowPassword((show) => !show)}
                    size={18}
                    className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2  hover:text-blue-500    transition-colors duration-300  '
                  />
                )}

                <Input
                  {...register('password')}
                  placeholder='密码'
                  className={`${formState.errors.password && 'border-red-500'}`}
                  type={showPassword ? 'text' : 'password'}
                  maxLength={20}
                />
                {formState.errors.password && (
                  <span className='text-red-500 text-sm'>
                    {formState.errors.password.message}
                  </span>
                )}
              </div>
              <Button
                type='submit'
                className='w-full mt-2.5'
                disabled={loading}
              >
                {login
                  ? `登录${loading ? '中...' : ''}`
                  : `注册${loading ? '中...' : ''}`}
              </Button>
            </form>
            <Separator className='mt-6' />
            <Link
              href='/try/board'
              className='text-sm text-center text-blue-500 cursor-pointer'
            >
              前往试用
            </Link>
            <p
              className=' cursor-pointer text-gray-500 text-sm text-center'
              onClick={() => setLogin(!login)}
            >
              {login ? '没有账号？点击注册' : '已有账号？点击登录'}
            </p>
          </section>
        </CardContent>
      </Card>
    </Protect>
  );
};

export default SignIn;
