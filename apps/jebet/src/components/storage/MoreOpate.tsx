import useUser from '@/store/user';
import {
  Download,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { bitToMB, downloadFile } from '@/lib/storage';
import { useDeleteStoage } from '@/server/hooks/stoages';
import { StoageData } from '@/types/workspace';
import { Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { TbDetails } from 'react-icons/tb';
import { useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { CardContent, CardHeader, CardTitle } from '../ui/card';
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
import { useQueryClient } from '@tanstack/react-query';

const MoreOpate = observer(({ row }: { row: Row<StoageData> }) => {
  const workspaceId = useParams().workspaceId;
  const queryClient = useQueryClient();
  const deleteRef = useRef<HTMLButtonElement>(null);
  const { deleteStoage, deleteStoagePending } = useDeleteStoage();
  if (!workspaceId || !useUser.userData) return;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <MoreVerticalIcon className='w-4 h-4 cursor-pointer' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[100px]'>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost' className='w-full cursor-pointer'>
                <TbDetails className='w-4 h-4' />
                <span>详情</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <CardHeader>
                <CardTitle>文件名: {row.original.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>文件描述: {row.original.description || '无'}</p>
                <p>文件类型: {row.original.type}</p>
                <p>文件大小: {bitToMB(row.original.size)}</p>
                <p>
                  文件创建时间:{' '}
                  {dayjs(row.original.created_at).format('YYYY-MM-DD HH:mm:ss')}
                </p>
                <p>
                  文件更新时间:{' '}
                  {dayjs(row.original.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                </p>
              </CardContent>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>关闭</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost' className='w-full cursor-pointer'>
                <PencilIcon className='w-4 h-4' />
                <span>编辑</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑文件</DialogTitle>
              </DialogHeader>
              <Form
                type='update'
                defaultData={row.original}
                userId={useUser.userData.id}
                workspaceId={workspaceId}
              ></Form>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>取消</Button>
                </DialogClose>
                <Button type='button'>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost' className='w-full cursor-pointer'>
                <TrashIcon className='w-4 h-4' />
                <span>删除</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>删除文件</DialogTitle>
                <DialogDescription>
                  确认删除文件
                  <span className='text-red-500 font-bold'>
                    {row.original.name}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' ref={deleteRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  type='button'
                  disabled={deleteStoagePending}
                  onClick={() => {
                    if (!useUser.userData) return;
                    deleteStoage(
                      {
                        json: {
                          userId: useUser.userData.id,
                          id: row.original.id,
                          file: row.original.file,
                          workspaceId: workspaceId,
                        },
                      },
                      {
                        onSuccess: () => {
                          toast.success('删除成功');
                          queryClient.invalidateQueries({
                            queryKey: ['stoages', workspaceId],
                          });
                          deleteRef.current?.click();
                        },
                        onError: (error) => {
                          toast.error(error.message);
                        },
                      }
                    );
                  }}
                >
                  删除
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            onClick={() =>
              downloadFile(
                row.original.file,
                row.original.name,
                row.original.type
              )
            }
            variant='ghost'
            className='w-full cursor-pointer'
          >
            <Download className='w-4 h-4' />
            <span>下载</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default MoreOpate;
