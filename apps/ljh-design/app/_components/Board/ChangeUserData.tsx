import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { logout, updateCurrentUser } from '@/app/_database/user';
import { useMap } from '@/app/_hook/query/useMap';
import { useUserChange, useUserChangePassword } from '@/app/_hook/query/useUserChange';
import { useUser } from '@/app/_store/auth';
import type { Sessions } from '@/app/_types/user';
import { to } from 'await-to-js';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import AvatarImage from '../Comand/AvatarImage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

const ChangeUserData = ({ data }: { data: Sessions }) => {
  const { setUser } = useUser();
  const defaultData = useRef(data.user.user_metadata);
  const router = useRouter();
  const ImageRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>(defaultData.current.name);
  const [image, setImage] = useState<File | string>(defaultData.current.image);
  const [region, setRegion] = useState<string[]>(
    (defaultData.current.region ?? '').split(',') || [],
  );
  const { mutate, isPending } = useUserChange();
  const { changePassword, changePasswordPending } = useUserChangePassword();
  const { data: mapData } = useMap();
  const [password, setPassword] = useState<string>('');
  const [repetPassword, setRepetPassword] = useState<string>('');

  // 修改头像
  function changeImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(file);
    e.target.value = '';
  }

  async function change(type: 'name' | 'password' | 'image' | 'region') {
    // 昵称不能超过20个字
    if (type === 'name') {
      if (name.length > 20) return toast.error('昵称不能超过20个字');
      if (!name) return toast.error('昵称不能为空');
      const [error] = await to(
        updateCurrentUser({
          datas: {
            type: 'name',
            name: name,
          },
        }),
      );
      if (error) return toast.error('修改失败');
      mutate(
        {
          json: {
            name: name,
          },
        },
        {
          onSuccess: () => {
            toast.success('修改成功');
          },
        },
      );
    }
    if (type === 'region') {
      if (region.length > 20) return toast.error('地区不能超过20个字');
      if (!region) return toast.error('地区不能为空');
      const regionStr = `${mapData?.districts.find((item) => item.adcode === region[0])?.name},${mapData?.districts.find((item) => item.adcode === region[0])?.districts.find((item) => item.adcode === region[1])?.name}`;
      const [error] = await to(
        updateCurrentUser({
          datas: {
            type: 'region',
            regionStr: regionStr,
            region,
          },
        }),
      );
      if (error) return toast.error('修改失败');
      mutate(
        {
          json: {
            region: region.join(','),
          },
        },
        {
          onSuccess: () => {
            toast.success('修改成功');
          },
        },
      );
    }
    // 修改密码
    if (type === 'password') {
      if (repetPassword !== password) return toast.error('两次密码不一致');
      // 密码不能超过20个字
      if (repetPassword.length > 20) return toast.error('密码不能超过20个字');
      if (password.length < 6) return toast.error('密码不能少于6个字');
      toast.loading('修改中...');
      changePassword(
        {
          json: {
            password: password,
          },
        },
        {
          onSuccess: async () => {
            toast.success('更新成功,请重新登录');
            await logout();
            setUser(null);
            router.push('/sign-in');
          },
          onError: (error) => {
            toast.error(error.message);
          },
          onSettled: () => {
            toast.dismiss();
          },
        },
      );
    }
    if (type === 'image') {
      const [error, data] = await to(
        updateCurrentUser({
          datas: {
            type: 'image',
            image: image || '',
            oldImageUrl: defaultData.current.image || '',
          },
        }),
      );
      defaultData.current.image = data?.user.user_metadata.image;
      toast.loading('修改中...');
      mutate(
        {
          json: {
            image: data?.user.user_metadata.image,
          },
        },
        {
          onSuccess: () => {
            toast.success('修改成功');
          },
        },
      );
      if (error) return toast.error('修改失败');
    }
  }

  return (
    <ScrollArea>
      <section className="flex flex-col gap-2">
        <header className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.back()}>
            返回
          </Button>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>用户姓名</CardTitle>
            <CardDescription>你在本站的昵称</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              className="w-[300px]"
              placeholder="本站昵称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex  bg-[#fafafa] dark:bg-gray-900 items-center py-4 justify-between border-t-1">
            <div className="text-sm ">昵称不能超过20个字</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => change('name')} disabled={isPending}>
                保存
              </Button>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>用户地区</CardTitle>
            <CardDescription>
              你在本站的地区
              {data && (
                <>
                  {region[0] && (
                    <span className="font-bold mx-2">
                      {mapData?.districts.find((item) => item.adcode === region[0])?.name}
                    </span>
                  )}
                  {region[1] && (
                    <span className="font-bold">
                      {
                        mapData?.districts
                          .find((item) => item.adcode === region[0])
                          ?.districts.find((item) => item.adcode === region[1])?.name
                      }
                    </span>
                  )}
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">选择地区</Button>
                </DialogTrigger>
                <DialogContent className="top-[30%]">
                  <DialogHeader>
                    <DialogTitle>选择地区</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="flex gap-2">
                    {region.length >= 1 && (
                      <Select
                        onValueChange={(value) => setRegion([value, region[1]])}
                        value={region[0]}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择省" />
                        </SelectTrigger>
                        <SelectContent>
                          {mapData?.districts.map((item) => (
                            <SelectItem key={item.adcode} value={item.adcode}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {region.length >= 2 && (
                      <Select
                        onValueChange={(value) => setRegion([region[0], value])}
                        value={region[1]}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择市" />
                        </SelectTrigger>
                        <SelectContent>
                          {mapData?.districts
                            ?.find((item) => item.adcode === region[0])
                            ?.districts?.map((item) => (
                              <SelectItem key={item.adcode} value={item.adcode}>
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!region[1]) setRegion([]);
                        }}
                      >
                        保存
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
          <CardFooter className="flex  bg-[#fafafa] dark:bg-gray-900 items-center py-4 justify-between border-t-1">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => change('region')}
                disabled={isPending && !region[0] && !region[1]}
              >
                保存
              </Button>
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
              <AvatarImage
                jump={false}
                userInfo={data.user.user_metadata}
                className="cursor-pointer aspect-1/1 hover:scale-110 transition-all border-1 border-gray-200 rounded-full"
                src={
                  image instanceof File ? URL.createObjectURL(image) : data.user.user_metadata.image
                }
                width={30}
                height={30}
                alt="用户图片"
                priority
              />
              {/* <Image
                src={
                  image instanceof File ? URL.createObjectURL(image) : data.user.user_metadata.image
                }
                alt="用户图片"
                className="cursor-pointer aspect-1/1 hover:scale-110 transition-all border-1 border-gray-200 rounded-full"
                width={100}
                height={100}
                priority={true}
              /> */}
              <input
                accept="image/gif, image/jpeg, image/png"
                className="hidden"
                type="file"
                onChange={changeImage}
                ref={ImageRef}
              />
            </div>
          </CardContent>
          <CardFooter className="flex  bg-[#fafafa] dark:bg-gray-900 items-center py-4 justify-between border-t-1">
            <div className="text-sm text-gray-500">自定义自己的头像，装饰你的账户</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  change('image');
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
                <Input
                  className="w-[300px]"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
          <CardFooter className="flex  bg-[#fafafa]  dark:bg-gray-900 items-center py-4 justify-between border-t-1">
            <div className="text-sm ">密码不能超过20个字</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={changePasswordPending}
                onClick={() => {
                  change('password');
                }}
              >
                保存
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    </ScrollArea>
  );
};

export default ChangeUserData;
