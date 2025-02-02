import { useDeleteFlow } from '@/server/hooks/flow';
import type { Flow } from '@/types/workspace';
import { useQueryClient } from '@tanstack/react-query';
import type { Row } from '@tanstack/react-table';
import { EyeIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Form from './Form';

const MoreOpate = observer(({ row }: { row: Row<Flow> }) => {
  const workspaceId = useParams().workspaceId;
  const queryClient = useQueryClient();
  const deleteRef = useRef<HTMLButtonElement>(null);
  const { deleteFlow, deleteFlowPending } = useDeleteFlow();
  if (!workspaceId) return;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <MoreVerticalIcon className="w-4 h-4 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[100px]">
        <DropdownMenuItem asChild>
          <Link to={`detail/${row.original.id}`}>
            <Button variant="ghost" className="w-full cursor-pointer">
              <EyeIcon className="w-4 h-4" />
              <span>详细</span>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full cursor-pointer">
                <PencilIcon className="w-4 h-4" />
                <span>编辑</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑工作流</DialogTitle>
              </DialogHeader>
              <Form type="update" defaultData={row.original} workspaceId={workspaceId} />
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full cursor-pointer">
                <TrashIcon className="w-4 h-4" />
                <span>删除</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>删除工作流</DialogTitle>
                <DialogDescription>
                  确认删除工作流
                  <span className="text-red-500 font-bold">{row.original.name}</span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" ref={deleteRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={deleteFlowPending}
                  onClick={() => {
                    deleteFlow(
                      {
                        json: {
                          id: row.original.id,
                          workspaceId: workspaceId,
                        },
                      },
                      {
                        onSuccess: () => {
                          toast.success('删除成功');
                          queryClient.invalidateQueries({
                            queryKey: ['flow', workspaceId],
                          });
                          deleteRef.current?.click();
                        },
                        onError: () => {
                          toast.error('删除失败');
                        },
                      },
                    );
                  }}
                >
                  删除
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default MoreOpate;
