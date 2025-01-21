import type { Flow } from '@/types/workspace';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown } from 'lucide-react';
import EditorButton from '../command/EditorButton';
import { Button } from '../ui/button';
import MoreOpate from './MoreOpate';

export const columns: ColumnDef<Flow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button className="text-center w-full max-w-[200px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          名称
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className="max-w-[200px] truncate text-center">{name}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button className="text-center w-full max-w-[200px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          描述
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <EditorButton title={row.getValue('description') as string}>
          <div className="max-w-[200px] truncate text-center">{row.getValue('description') as string}</div>
        </EditorButton>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button className="text-center w-full max-w-[200px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          创建时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <EditorButton title={dayjs(row.getValue('created_at')).format('YYYY-MM-DD HH:mm:ss')}>
          <div className="max-w-[200px] truncate text-center">{dayjs(row.getValue('created_at')).format('YYYY-MM-DD HH:mm:ss')}</div>
        </EditorButton>
      );
    },
  },

  {
    accessorKey: 'action',
    header: '操作',
    cell: ({ row }) => {
      return <MoreOpate row={row} />;
    },
  },
];
