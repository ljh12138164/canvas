import type { Sessions } from '@/app/_types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
const zodShema = z.object({
  name: z.string().min(2, '用户名长度至少为2位'),
  password: z.string().min(6, '密码长度至少为6位').max(16, '密码长度最多为16位').optional(),
  image: z.string({ message: '头像不能为空' }),
});

const ChangeUserData = ({ data }: { data: Sessions }) => {
  // console.log(data);
  const { register, handleSubmit, setValue, setError } = useForm({
    resolver: zodResolver(zodShema),
    defaultValues: {
      name: data.user.user_metadata.name,
      image: data.user.user_metadata.image,
      password: '',
    },
  });
  const ImageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [repetPassword, setRepetPassword] = useState<string>('');
  function hanldersSubmit(data: z.infer<typeof zodShema>) {
    if (data.password !== repetPassword) {
      setError('password', { message: '两次密码不一致' });
      return;
    }
  }
  function changeImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    e.target.value = '';
    // setValue("image", e.target.value);
  }
  return (
    <ScrollArea>
      <form onSubmit={handleSubmit(hanldersSubmit)} className="flex flex-col gap-5 px-2 py-4">
        <Card>
          <CardHeader>
            <CardTitle>用户姓名</CardTitle>
            <CardDescription>你在本站的昵称</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Input type="text" {...register('name')} className="w-[300px]" />
            </div>
          </CardContent>
          <CardFooter className="flex  bg-[#fafafa] items-center py-4 justify-between border-t-1">
            <div className="text-sm text-gray-500">昵称不能超过20个字</div>
            <div className="flex gap-2">
              <Button variant="outline">保存</Button>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>用户头像</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between gap-2">
            <CardDescription className="flex flex-col gap-2">
              <span>你在本站的头像</span>

              <span>点击图片可更换头像</span>
            </CardDescription>
            <div
              onClick={() => {
                ImageRef.current?.click();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  ImageRef.current?.click();
                }
              }}
            >
              <Image
                src={image || data.user.user_metadata.image}
                alt="用户图片"
                className="cursor-pointer aspect-[1/1] hover:scale-110 transition-all border-1 border-gray-200 rounded-full"
                width={100}
                height={100}
              />
              <input
                accept="image/gif, image/jpeg, image/png"
                className="hidden"
                type="file"
                onChange={changeImage}
                ref={ImageRef}
              />
            </div>
          </CardContent>
          <CardFooter className="flex  bg-[#fafafa] items-center py-4 justify-between border-t-1">
            <div className="text-sm text-gray-500">自定义自己的头像，装饰你的账户</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setValue('image', data.user.user_metadata.image);
                  setImage(null);
                }}
              >
                保存
              </Button>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>密码</CardTitle>
            <CardDescription className="">
              <span>用于登录账户的密码</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex  flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-gray-500">新密码</Label>
                <Input className="w-[300px]" type="text" {...register('password')} />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-gray-500">重复输入新密码</Label>
                <Input
                  className="w-[300px]"
                  type="text"
                  value={repetPassword}
                  onChange={(e) => setRepetPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex  bg-[#fafafa] items-center py-4 justify-between border-t-1">
            <div className="text-sm text-gray-500">密码不能超过20个字</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setValue('password', '');
                  setRepetPassword('');
                }}
              >
                保存
              </Button>
            </div>
          </CardFooter>
        </Card>
        <Separator />
      </form>
    </ScrollArea>
  );
};

export default ChangeUserData;
