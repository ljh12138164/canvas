'use client';

import { Response } from '@/app/_components/Comand/Response';
import Tiptap from '@/app/_components/Comand/RiceEdit/Edit';
import { Render } from '@/app/_components/Formue/Render';
import { Button } from '@/app/_components/ui/button';
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { useDeleteTopic, useEditTopic, useGetTopic } from '@/app/_hook/query/ustTopic';
import { useUser } from '@/app/_store/auth';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import './page.css';

export default function TopicPage() {
  const { user, loading } = useUser();
  const queryClient = useQueryClient();
  const { topicData, topicLoading, topicError } = useGetTopic(user?.user?.id || '');
  const { editTopic, editTopicPending } = useEditTopic();
  const { deleteTopic, deleteTopicPending } = useDeleteTopic();
  const responseRef = useRef<{ closeModel: () => void }>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<{
    id: string;
    title: string;
    explanation: string;
  } | null>(null);

  // 处理编辑话题
  const handleEditTopic = (topic: any) => {
    setCurrentTopic({
      id: topic.id,
      title: topic.title || '',
      explanation: topic.explanation || '',
    });
    setEditDialogOpen(true);
  };

  // 提交编辑
  const handleSubmitEdit = () => {
    if (!currentTopic) return;

    editTopic(
      {
        json: {
          id: currentTopic.id,
          name: currentTopic.title,
          explanation: currentTopic.explanation,
        },
      },
      {
        onSuccess: () => {
          toast.success('话题编辑成功');
          setEditDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['topic'] });
        },
        onError: (error) => {
          toast.error(`编辑失败: ${error.message}`);
        },
      },
    );
  };

  // 处理删除话题
  const handleDeleteTopic = (id: string) => {
    deleteTopic(
      { json: { id } },
      {
        onSuccess: () => {
          toast.success('话题删除成功');
          responseRef.current?.closeModel();
        },
        onError: (error) => {
          toast.error(`删除失败: ${error.message}`);
        },
      },
    );
  };

  if (topicLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">加载中...</p>
      </div>
    );
  }

  if (topicError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-red-500">加载失败: {topicError.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b pb-2">我的话题管理</h1>

      {topicData && topicData.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicData.map((topic) => (
              <Card key={topic.id} className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="truncate text-lg">{topic.title || '无标题'}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    创建于 {new Date(topic.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="line-clamp-3 MAN min-h-[4.5rem]">
                    <Render content={topic.explanation || '无描述'} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTopic(topic)}
                    disabled={editTopicPending}
                    className="flex items-center"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                  <Response
                    title="删除话题"
                    description="删除话题"
                    showDescription={false}
                    myTrigger={
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        disabled={deleteTopicPending}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" type="button" aria-label="删除话题" />
                        删除
                      </Button>
                    }
                    ref={responseRef}
                    onConfirm={() => {
                      handleDeleteTopic(topic.id);
                      responseRef.current?.closeModel();
                    }}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/20 shadow-sm">
          <h3 className="text-xl font-medium mb-2">暂无话题</h3>
          <p className="text-muted-foreground mb-4">您还没有创建任何话题</p>
        </div>
      )}

      {/* 编辑话题对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑话题</DialogTitle>
            <DialogDescription>修改话题信息后点击保存按钮提交更改。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium">
                话题标题
              </Label>
              <Input
                id="title"
                value={currentTopic?.title || ''}
                onChange={(e) =>
                  setCurrentTopic((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
                className="col-span-3"
                placeholder="请输入话题标题"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Label htmlFor="explanation" className="font-medium mb-1">
                话题描述
              </Label>
              <div className="w-full ">
                <Tiptap
                  content={currentTopic?.explanation || ''}
                  onUpdate={(value: string) => {
                    setCurrentTopic((prev) => (prev ? { ...prev, explanation: value } : null));
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleSubmitEdit}
              disabled={editTopicPending}
              className="min-w-[100px]"
            >
              {editTopicPending ? '保存中...' : '保存更改'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
