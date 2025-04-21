'use client';
import { useClone } from '@/app/_hook/query/useClone';
import { useCreateMaterial } from '@/app/_hook/query/useMaterial';
import type { GetShowResponseType } from '@/app/_hook/query/useShow';
import { useUser } from '@/app/_store/auth';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 } from 'uuid';
import BoardCreateFrom from '../Board/BoardCreateFrom';
import AvatarImage from '../Comand/AvatarImage';
import { Response } from '../Comand/Response';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function ShowHead({
  showData,
  remarkRef,
}: { showData: GetShowResponseType; remarkRef: React.RefObject<HTMLDivElement | null> }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { mutate: clone } = useClone();
  const { mutate: createMaterial } = useCreateMaterial();
  const [cloneType, setCloneType] = useState<'template' | 'board'>('template');
  const [cloneName, setCloneName] = useState('');
  const onClick = () => remarkRef.current?.scrollIntoView({ behavior: 'smooth' });
  const responseRef = useRef<{
    closeModel: () => void;
  }>(null);
  const meteresponseRef = useRef<{
    closeModel: () => void;
  }>(null);
  const mutate = (data: any) => {
    clone(
      {
        json: {
          type: cloneType,
          name: data.name,
          id: v4(),
          cloneId: showData.board?.id,
          json: data,
          image: showData.board?.image,
        },
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success(`克隆成功,请前往${cloneType === 'template' ? '模板' : '看板'}查看`);
          responseRef.current?.closeModel();
          queryClient.invalidateQueries({ queryKey: ['board'] });
          queryClient.invalidateQueries({ queryKey: ['boardList'] });
          queryClient.invalidateQueries({ queryKey: ['templateUser'] });
        },
      },
    );
  };
  const cloneMaterial = () => {
    toast.loading('克隆中...');
    if (!cloneName.trim()) {
      toast.error('请输入克隆名称');
      return;
    }
    createMaterial(
      {
        json: {
          material: showData.material.options,
          name: cloneName,
          id: nanoid(),
          cloneId: showData.material.id,
        },
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success('保存成功,请前往素材查看');
          setCloneName('');
          meteresponseRef.current?.closeModel();
          queryClient.invalidateQueries({ queryKey: ['material'] });
        },
      },
    );
  };
  return (
    <section className="flex flex-col gap-3 pb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold">{showData.title}</h2>
      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
        <section className="flex items-center gap-2">
          <AvatarImage
            userInfo={showData.profiles!}
            src={showData.profiles.image || ''}
            alt="用户头像"
            width={30}
            height={30}
            priority
          />
          <span className="text-sm whitespace-nowrap">
            {showData.profiles.name}
            {user?.user.user_metadata.sub === showData.profiles.id && (
              <span className="ml-2">(我)</span>
            )}
          </span>
        </section>
        <span className="text-sm whitespace-nowrap">
          发布时间:{dayjs(showData.created_at).format('YYYY年MM月DD日 HH:mm:ss')}
        </span>
        {showData.tags && (
          <div className="mr-2 flex flex-wrap gap-2">
            标签：
            {showData.tags.split(',').map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
        <Button onClick={onClick} type="button" variant="outline" className="h-8" aria-label="跳转">
          跳转到评论
        </Button>
        {user?.user.user_metadata.sub !== showData.profiles.id && showData.type === 'template' && (
          <Response
            title="克隆"
            description="克隆到我的模板或看板"
            ref={responseRef}
            showFooter={false}
            // onConfirm={() => {
            //   responseRef.current?.closeModel();
            // }}
          >
            <BoardCreateFrom
              defaultValues={showData.board}
              type="create"
              isClone={true}
              userId={user?.user?.user_metadata?.sub}
              closeref={responseRef}
              mutate={mutate as any}
            >
              <Select
                value={cloneType}
                onValueChange={(value) => setCloneType(value as 'template' | 'board')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择克隆类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">模板</SelectItem>
                  <SelectItem value="board">看板</SelectItem>
                </SelectContent>
              </Select>
              <section className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8"
                  onClick={() => {
                    responseRef.current?.closeModel();
                  }}
                  aria-label="取消"
                >
                  取消
                </Button>
                <Button type="submit" className="h-8">
                  克隆
                </Button>
              </section>
            </BoardCreateFrom>
          </Response>
        )}
        {user?.user.user_metadata.sub !== showData.profiles.id && showData.type === 'material' && (
          <Response
            title="克隆"
            description="克隆到我的素材"
            showDescription={true}
            ref={meteresponseRef}
            onConfirm={cloneMaterial}
          >
            <Input
              placeholder="请输入克隆名称"
              value={cloneName}
              onChange={(e) => setCloneName(e.target.value)}
            />
          </Response>
        )}
      </div>
    </section>
  );
}
