'use client';

import { UserProfile } from '@/app/_components/UserProfile';
import { PostList } from '@/app/_components/UserProfile/PostList';
import { Alert, AlertDescription, AlertTitle } from '@/app/_components/ui/alert';
import { Button } from '@/app/_components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { useUserProfile } from '@/app/_hook/query/useUser';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { userProfile, userProfileLoading, isError, error } = useUserProfile(userId);

  if (userProfileLoading) {
    return <></>;
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>获取用户信息失败</AlertTitle>
          <AlertDescription>{error?.message || '未知错误，请稍后再试'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userProfile?.userInfo) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>未找到用户</AlertTitle>
          <AlertDescription>该用户不存在或已被删除</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <nav className="flex items-center justify-between py-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          返回
        </Button>
      </nav>
      {/* 用户基本信息 */}
      <UserProfile userInfo={userProfile.userInfo} />

      {/* 用户内容标签页 */}
      <div className="mt-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">发布的帖子</TabsTrigger>
            <TabsTrigger value="likes">点赞的帖子</TabsTrigger>
            <TabsTrigger value="collections">收藏的帖子</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostList items={userProfile.posts} type="posts" />
          </TabsContent>
          <TabsContent value="likes">
            <PostList items={userProfile.likes.map((item) => item.show)} type="likes" />
          </TabsContent>
          <TabsContent value="collections">
            <PostList items={userProfile.collections.map((item) => item.show)} type="collections" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
