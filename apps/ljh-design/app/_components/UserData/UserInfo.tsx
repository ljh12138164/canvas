'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/Avatar';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/_components/ui/card';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { useUserCollection, useUserLike } from '@/app/_hook/query/useUser';
import { useUser } from '@/app/_store/auth';
import { PencilIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserColleciton } from './UserCollection';
import { UserLike } from './UserLike';

export default function UserInfo() {
  const router = useRouter();
  // 默认get
  const [collection, setCollection] = useState<boolean>(!!localStorage.getItem('USER_GET'));
  const { userLike, userLikeLoading } = useUserLike(!!collection);
  const { userCollection, userCollectionLoading } = useUserCollection(!collection);
  const { user } = useUser();

  return (
    <ScrollArea className="max-h-[calc(100dvh-100px)] ">
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
          <CardHeader>
            <nav className="flex gap-2 bg-indigo-500 dark:bg-indigo-500/10 w-[200px] items-center justify-center p-2 text-white rounded-md">
              <Button
                variant="ghost"
                className={`flex items-center justify-center transition-all duration-300 hover:bg-indigo-500 ${collection ? 'bg-indigo-500' : ''}`}
                onClick={() => setCollection(true)}
              >
                我的点赞
              </Button>
              <Button
                variant="ghost"
                className={`flex items-center justify-center transition-all duration-300 hover:bg-indigo-500 ${!collection ? 'bg-indigo-500' : ''}`}
                onClick={() => setCollection(false)}
              >
                我的收藏
              </Button>
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
    </ScrollArea>
  );
}
