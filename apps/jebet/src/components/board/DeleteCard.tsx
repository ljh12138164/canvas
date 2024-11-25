import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteWorkspace } from '@/server/hooks/board';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useProjectDelete } from '@/server/hooks/project';
export default function DeleteCard({
  type,
  canEdit,
  imageUrl,
  projectId,
  workspaceId,
  userId,
}: {
  type: 'workspace' | 'project';
  projectId?: string;
  canEdit: boolean;
  workspaceId?: string;
  userId: string;
  imageUrl: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { deleteWorkspace, isDeleting } = useDeleteWorkspace();
  const { deleteProject, isDeletingProject } = useProjectDelete();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleDelete = () => {
    if (type === 'workspace') {
      if (!workspaceId) return;
      deleteWorkspace(
        { param: { id: workspaceId }, json: { userId, imageUrl } },
        {
          onSuccess: () => {
            toast.success('删除成功');
            queryClient.invalidateQueries({ queryKey: ['workspace', userId] });
            closeRef.current?.click();
            navigate('/dashboard/home');
          },
          onError: () => {
            toast.error('删除失败');
          },
        }
      );
    } else {
      if (!projectId || !workspaceId) return;
      deleteProject(
        { json: { userId, workspaceId, projectId, imageUrl } },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success('删除成功');
            queryClient.invalidateQueries({
              queryKey: ['projectList', workspaceId],
            });
            navigate(`/dashboard/${workspaceId}/home`);
            closeRef.current?.click();
          },
          onError: () => {
            toast.error('删除失败');
          },
        }
      );
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>删除{type === 'workspace' ? '工作区' : '项目'}</CardTitle>
        <CardDescription>
          删除{type === 'workspace' ? '工作区' : '项目'}将删除所有
          {type === 'workspace' ? '工作区' : '项目'}数据，请谨慎操作
        </CardDescription>
      </CardHeader>
      <CardFooter className='flex justify-end'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='destructive' disabled={!canEdit}>
              删除{type === 'workspace' ? '工作区' : '项目'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                删除{type === 'workspace' ? '工作区' : '项目'}
              </DialogTitle>
              <DialogDescription>
                删除{type === 'workspace' ? '工作区' : '项目'}将删除所有
                {type === 'workspace' ? '工作区' : '项目'}数据，请谨慎操作
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' ref={closeRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  variant='destructive'
                  onClick={handleDelete}
                  disabled={isDeleting || isDeletingProject}
                >
                  {isDeleting
                    ? '删除中...'
                    : `删除${type === 'workspace' ? '工作区' : '项目'}`}
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
