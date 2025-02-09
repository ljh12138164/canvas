'use client';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { useUser } from '@/app/_store/auth';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import type { BoardData } from '../../_types/board';
import { BoardCopy } from './BoardCopy';
import BoardDelete from './BoardDelete';
import BoardEdit from './BoardEdit';
import { DataTableColumnHeader } from './BoardTableColumnHeader';
export const columns: ColumnDef<BoardData>[] = [
  {
    accessorKey: 'image',
    header: ({ column }) => {
      return <DataTableColumnHeader title="图片" column={column} />;
    },
    cell: ({ row }) => {
      return (
        <p className="flex items-center " onClick={(e) => e.stopPropagation()}>
          <PhotoProvider>
            <PhotoView src={row.original.image || ''}>
              <Image
                src={row.original.image || ''}
                alt={row.original.name || ''}
                width={50}
                height={50}
                className="rounded-md border-2 border-gray-600"
              />
            </PhotoView>
          </PhotoProvider>
        </p>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader title="面板名字" column={column} />;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return <DataTableColumnHeader title="创建时间" column={column} type="date" />;
    },
    cell: ({ row }) => {
      const payment = row.original;
      return <p>{dayjs(payment.created_at).format('MM月DD日 HH:mm:ss')}</p>;
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return <DataTableColumnHeader title="更新时间" column={column} type="date" />;
    },
    cell: ({ row }) => {
      const payment = row.original;
      return <p>{dayjs(payment.updated_at).format('MM月DD日 HH:mm:ss')}</p>;
    },
  },
  {
    id: 'actions',
    header: () => {
      return <div>操作</div>;
    },
    cell: ({ row }) => {
      const payment = row.original;
      const { user } = useUser();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className="sr-only">打开菜单</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <BoardEdit id={payment.id} data={payment} userId={user?.user?.id}>
                <Button variant="ghost" className="w-full">
                  编辑
                </Button>
              </BoardEdit>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <BoardCopy userId={user?.user?.id} board={payment}>
                <Button variant="ghost" className="w-full">
                  复制
                </Button>
              </BoardCopy>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <BoardDelete id={payment.id} userId={user?.user?.id} board={payment}>
                <Button variant="ghost" className="w-full">
                  删除
                </Button>
              </BoardDelete>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
