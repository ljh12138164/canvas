'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/Avatar';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/_components/ui/card';
import { useUserCollection, useUserLike } from '@/app/_hook/query/useUser';
import { useUser } from '@/app/_store/auth';
import { debounce } from 'lodash-es';
import { PencilIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Input } from '../ui/input';
import { UserColleciton } from './UserCollection';
import { UserLike } from './UserLike';

export default function UserInfo() {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useCallback(debounce(setSearch, 1000), []);
  // 默认get
  const [collection, setCollection] = useState<boolean>(!!localStorage.getItem('USER_GET'));
  const { userLike, userLikeLoading } = useUserLike(!!collection, search);
  const { userCollection, userCollectionLoading } = useUserCollection(!collection, search);
  const { user } = useUser();

  return (
    <section className="flex flex-col gap-4">
      <Card className="w-full  mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.user.user_metadata.image} />
              <AvatarFallback>
                <UserIcon className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">用户名</p>
                <p className="text-lg font-medium">{user?.user.user_metadata.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">邮箱</p>
                <p className="text-lg">{user?.user.user_metadata.email}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button onClick={() => router.push('/board/user/change')} variant="outline">
            <PencilIcon className="mr-2 h-4 w-4" />
            编辑资料
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex justify-between">
          <nav className="flex gap-2 justify-between ">
            <section className="flex gap-2   w-[200px] items-center justify-center p-2 rounded-md border">
              <Button
                variant="ghost"
                className={`flex items-center justify-center transition-all duration-300  ${collection ? 'bg-slate-100' : ''}`}
                onClick={() => setCollection(true)}
              >
                我的点赞
              </Button>
              <Button
                variant="ghost"
                className={`flex items-center justify-center transition-all duration-300  ${!collection ? 'bg-slate-100' : ''}`}
                onClick={() => setCollection(false)}
              >
                我的收藏
              </Button>
            </section>
            <Input
              className="w-[200px]"
              placeholder="搜索"
              onChange={(e) => {
                debouncedSearch(e.target.value);
              }}
            />
          </nav>
        </CardHeader>
        <CardContent>
          {collection ? (
            <UserLike data={userLike} loading={userLikeLoading} />
          ) : (
            <UserColleciton data={userCollection} loading={userCollectionLoading} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
