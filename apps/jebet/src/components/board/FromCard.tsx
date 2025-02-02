import { useCreateWorkspace, useUpdateWorkspace } from '@/server/hooks/board';
import { useProjectCreate, useProjectUpdate } from '@/server/hooks/project';
import { DEFAULT_AVATAR } from '@/server/supabase/user';
import type { Profiles } from '@/types/user';
import { DEFAULT_ICON } from '@/utils/board';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { type ChangeEvent, type RefObject, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { z } from 'zod';
import { Button } from '../ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

const zodShema = z.object({
  name: z.string().min(1, { message: '仪表盘名称不能为空' }),
  file: z.any().optional(),
});

const Footer = styled.div<{ type: 'create' | 'edit' }>`
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: ${({ type }) => (type === 'edit' ? 'flex-end' : 'space-between')};
`;
const ImageContent = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
`;
const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
`;
const UploadP = styled.p`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
`;
const ButtonContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

/**
 * 表单卡片(工作区、项目)
 * @param param0
 * @returns
 */
const FromCard = ({
  formType,
  canEdit = true,
  type,
  Back,
  editId,
  // workspace,
  showFooter = true,
  defaultFrom,
  userData,
  closeRef,
}: {
  formType: 'workspace' | 'project';
  canEdit?: boolean;
  Back?: boolean;
  // workspace: Workspace;
  editId?: string;
  type: 'create' | 'edit';
  showFooter?: boolean;
  defaultFrom?: {
    name: string;
    file: string;
  };
  userData: Profiles;
  closeRef?: RefObject<HTMLButtonElement | null>;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const params = useParams();
  const [file, setFile] = useState<string>(defaultFrom?.file || '');
  // 创建工作区
  const { createWorkspace, isCreating } = useCreateWorkspace();
  // 更新工作区
  const { updateWorkspace, isUpdating } = useUpdateWorkspace();
  // 创建project
  const { createProject, isCreatingProject } = useProjectCreate();
  // 更新project
  const { updateProject, isUpdatingProject } = useProjectUpdate();
  const navigator = useNavigate();
  const { register, handleSubmit, formState, setError, getValues, setValue } = useForm({
    resolver: zodResolver(zodShema),
    defaultValues: {
      name: defaultFrom?.name || '',
      file: defaultFrom?.file || DEFAULT_ICON,
    },
  });

  // 提交
  const onSubmit = (data: z.infer<typeof zodShema>) => {
    if (data.file instanceof File) {
      if (data.file.size > 1024 * 1024 * 5) {
        setError('file', {
          message: '文件过大重新上传',
        });
      }
    }
    if (!data?.file) {
      data.file = DEFAULT_ICON;
    }

    if (!userData) return;
    if (formType === 'workspace') {
      if (type === 'create') {
        createWorkspace(
          {
            form: {
              ...data,
              email: userData.email,
              userImage: userData.image || DEFAULT_AVATAR,
              username: userData.name || `用户${nanoid(4)}`,
            },
          },
          {
            onSuccess: (data) => {
              closeRef?.current?.click();
              queryClient.setQueryData(['workspace', userData.id], data);
              navigator(`/dashboard/${data.id}`);
            },
          },
        );
      } else {
        if (defaultFrom?.file === data.file && defaultFrom?.name === data.name) {
          toast.dismiss();
          toast.success('更新成功');
          return;
        }
        if (editId && canEdit) {
          updateWorkspace(
            {
              form: {
                ...data,
                id: editId,
                oldImageUrl: defaultFrom?.file || DEFAULT_ICON,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ['workspace', userData.id],
                });
                toast.dismiss();
                toast.success('更新成功');
              },
              onError: () => {
                toast.error('更新失败');
              },
            },
          );
        } else {
          toast.error('无权限');
        }
      }
    } else {
      const workspace = params.workspaceId;
      if (!workspace) {
        toast.error('请先选择工作区');
        return;
      }
      if (type === 'create') {
        createProject(
          {
            form: {
              ...data,
              workspaceId: workspace,
            },
          },
          {
            onSuccess: (data) => {
              closeRef?.current?.click();
              queryClient.invalidateQueries({
                queryKey: ['projectList', workspace],
              });
              navigator(`/dashboard/${workspace}/${data.id}`);
            },
            onError: () => {
              toast.error('创建失败');
            },
          },
        );
      } else {
        if (editId && canEdit) {
          updateProject(
            {
              form: {
                ...data,
                projectId: editId,
                workspaceId: workspace,
                oldImageUrl: defaultFrom?.file || DEFAULT_ICON,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ['projectList', workspace],
                });
                toast.dismiss();
                toast.success('更新成功');
              },
            },
          );
        }
      }
    }
  };

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes('image')) return toast.error('请上传正确的图片格式');
    if (file.size <= 1024 * 1024 * 5) {
      setFile(URL.createObjectURL(file));
      // @ts-ignore
      setValue('file', file);
    } else {
      toast.error('图片大小不能超过5M');
    }
    e.target.value = '';
  }

  return (
    <div className="w-full">
      <CardHeader className="flex flex-row gap-4 items-center">
        {Back && (
          <Button className="w-16 h-full" variant="outline" onClick={() => navigator(-1)}>
            返回
          </Button>
        )}
        <div>
          <CardTitle>
            {type === 'create'
              ? formType === 'workspace'
                ? '创建工作区'
                : '创建项目'
              : '更新仪表盘'}
          </CardTitle>
          <CardDescription>
            {type === 'create'
              ? `创建${formType === 'workspace' ? '工作区' : '项目'}，开始管理你的${formType === 'workspace' ? '项目' : ''}`
              : `更新${formType === 'workspace' ? '工作区' : '项目'}，管理你的${formType === 'workspace' ? '项目' : ''}`}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-xl mb-4" htmlFor="name">
            {formType === 'workspace' ? '工作区名称' : '项目名称'}
          </label>
          <Input
            className={`${formState.errors.name ? 'border-red-500' : ''}`}
            id="name"
            {...register('name')}
          />
          <p className="text-red-500">{formState.errors.name?.message}</p>

          <ImageContent>
            <Image src={file || getValues('file')} alt="icon" />
            <UploadP>
              <span className="text-xl">
                {formType === 'workspace' ? '工作区图标' : '项目图标'}
              </span>
              <span className="text-slate-500/50 dark:text-slate-400/50">
                支持jpg、png、jpeg、svg格式，大小不超过5M
                <span className="text-red-500">{}</span>
              </span>
              <ButtonContent>
                <Button
                  className="w-32"
                  type="button"
                  variant="outline"
                  onClick={(event) => {
                    event.preventDefault();
                    if (fileRef.current) {
                      fileRef.current.click();
                    }
                  }}
                >
                  点击上传
                </Button>
                <Button
                  type="button"
                  className="transition-all duration-300"
                  variant="destructive"
                  onClick={() => {
                    setFile('');
                    setValue('file', defaultFrom?.file || DEFAULT_ICON);
                  }}
                >
                  重置图片
                </Button>
              </ButtonContent>
            </UploadP>
          </ImageContent>
          <Separator className="mt-6" />
          <Input
            {...register('file', { onChange: handleFileChange })}
            accept=".jpg,.png,.jpeg,.svg"
            id="file"
            ref={fileRef}
            type="file"
            className="hidden"
          />
          {showFooter && (
            <Footer type={type}>
              {type === 'create' && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    closeRef?.current?.click();
                  }}
                >
                  取消
                </Button>
              )}
              <Button
                variant="primary"
                type="submit"
                className="dark:text-white"
                disabled={
                  !canEdit || isCreating || isUpdating || isCreatingProject || isUpdatingProject
                }
              >
                {isCreating
                  ? '创建中...'
                  : isUpdating
                    ? '更新中...'
                    : type === 'create'
                      ? `创建${formType === 'workspace' ? '工作区' : '项目'}`
                      : `更新${formType === 'workspace' ? '工作区' : '项目'}`}
              </Button>
            </Footer>
          )}
        </form>
      </CardContent>
    </div>
  );
};

export default FromCard;
