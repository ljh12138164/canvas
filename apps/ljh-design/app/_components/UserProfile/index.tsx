'use client';

import type { Profiles } from '@/app/_types/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Card, CardContent } from '../ui/card';

interface UserProfileProps {
  userInfo: Profiles & {
    show?: any[];
    upvotes?: any[];
    collections?: any[];
  };
}

export function UserProfile({ userInfo }: UserProfileProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={userInfo.image || ''} alt={userInfo.name} />
          <AvatarFallback className="text-2xl">
            {userInfo.name?.substring(0, 2) || userInfo.email?.substring(0, 2) || '用户'}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold">{userInfo.name || '匿名用户'}</h2>
          <p className="text-muted-foreground mt-1">{userInfo.email}</p>

          <div className="mt-4 flex items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="font-semibold">{userInfo.show?.length || 0}</span>
              <span className="text-sm text-muted-foreground">帖子</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{userInfo.upvotes?.length || 0}</span>
              <span className="text-sm text-muted-foreground">点赞</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{userInfo.collections?.length || 0}</span>
              <span className="text-sm text-muted-foreground">收藏</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
