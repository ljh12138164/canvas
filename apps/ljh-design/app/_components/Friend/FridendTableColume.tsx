'use client';
import { Button } from '@/app/_components/ui/button';
import { useUser } from '@/app/_store/auth';
import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import type { Profiles } from '../../_types/user';

import { DataTableColumnHeader } from './FridendTableColumnHeader';
export const columns: ColumnDef<Profiles>[] = [
  {
    accessorKey: 'image',
    header: ({ column }) => {
      return <DataTableColumnHeader title="用户头像" column={column} />;
    },
    cell: ({ row }) => {
      return (
        <p className="flex items-center " onClick={(e) => e.stopPropagation()}>
          <PhotoProvider>
            <PhotoView src={row.original.image || ''}>
              <Image
                priority
                src={row.original.image || ''}
                alt={row.original.name || ''}
                width={50}
                height={50}
                className="rounded-md border-2 aspect-square border-gray-600"
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
      return <DataTableColumnHeader title="用户名字" column={column} />;
    },
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => {
      return <DataTableColumnHeader title="用户邮箱" column={column} />;
    },
    cell: ({ row }) => {
      return <div>{row.original.email}</div>;
    },
  },
  {
    accessorKey: 'actions',
    header: () => {
      return <div>操作</div>;
    },
    cell: ({ row }) => {
      const payment = row.original;
      const { user } = useUser();

      return <Button>11</Button>;
    },
  },
];
