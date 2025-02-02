import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/hooks/useUser';
import { login, signup } from '@/server/supabase/user';
import { zodResolver } from '@hookform/resolvers/zod';
import to from 'await-to-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { z } from 'zod';
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TabButton = styled(Button)<{ $active?: boolean }>`
  transition: all 0.2s ease;
  &:hover {
    background-color: ${(props) => (props.$active ? '' : 'rgba(0,0,0,0.05)')};
  }
  ${(props) =>
    props.$active &&
    `
    background-color: rgb(228 228 231);
    &:hover {
      background-color: rgb(228 228 231);
    }
  `}
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const schema = z.object({
  email: z.string({ message: '请输入邮箱' }).email({ message: '请输入正确的邮箱' }),
  password: z
    .string({ message: '请输入密码' })
    .min(6, { message: '密码至少6位' })
    .max(16, { message: '密码最多16位' }),
  username: z
    .string({ message: '请输入用户名' })
    .min(3, { message: '用户名至少3位' })
    .max(10, { message: '用户名最多10位' })
    .optional(),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [sign, setSign] = useState(false);
  const { isLoading, isSignedIn } = useUser({ redirect: false, type: 'sign' });
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isSignedIn) return <Navigate to="/dashboard" />;
  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (sign) {
      if (!data.username) {
        toast.dismiss();
        toast.error('请输入用户名');
        return;
      }
      // 注册
      const [error] = await to(
        signup({ email: data.email, password: data.password, username: data.username }),
      );
      if (error) {
        toast.dismiss();
        toast.error('注册失败');
        return;
      }
      toast.dismiss();
      toast.success('前往邮箱验证');
    } else {
      // 登录
      const [error] = await to(login({ email: data.email, password: data.password }));
      if (error) {
        toast.dismiss();
        toast.error('登录失败');
        return;
      }
      toast.dismiss();
      toast.success('登录成功');
      navigate('/dashboard');
    }
  };
  return (
    <Container>
      <LoginCard>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">登录 Jebet</CardTitle>
        </CardHeader>
        <CardContent>
          <ButtonContainer>
            <div className="grid grid-cols-2 gap-2">
              <TabButton variant="outline" $active={!sign} onClick={() => setSign(false)}>
                登录
              </TabButton>
              <TabButton variant="outline" $active={sign} onClick={() => setSign(true)}>
                注册
              </TabButton>
            </div>

            <FormContainer onSubmit={handleSubmit(onSubmit)}>
              {sign && (
                <InputGroup>
                  <Label htmlFor="username" className="text-sm">
                    用户名
                  </Label>
                  <Input {...register('username')} placeholder="请输入用户名" className="h-10" />
                  {formState.errors.username && (
                    <p className="text-red-500 text-sm">{formState.errors.username.message}</p>
                  )}
                </InputGroup>
              )}
              <InputGroup>
                <Label htmlFor="email" className="text-sm">
                  邮箱
                </Label>
                <Input
                  {...register('email')}
                  placeholder="请输入邮箱地址"
                  type="email"
                  className="h-10"
                />
                {formState.errors.email && (
                  <p className="text-red-500 text-sm">{formState.errors.email.message}</p>
                )}
              </InputGroup>
              <InputGroup>
                <Label htmlFor="password" className="text-sm">
                  密码
                </Label>
                <Input
                  {...register('password')}
                  placeholder="请输入密码"
                  type="password"
                  className="h-10"
                />
                {formState.errors.password && (
                  <p className="text-red-500 text-sm">{formState.errors.password.message}</p>
                )}
              </InputGroup>
              <Button type="submit" className="w-full h-10 mt-2">
                {sign ? '登录' : '注册'}
              </Button>
            </FormContainer>
          </ButtonContainer>
        </CardContent>
      </LoginCard>
    </Container>
  );
}
