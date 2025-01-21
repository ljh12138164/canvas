import { bitToMB, checkIsImage } from '@/lib/storage';
import type { StoageData } from '@/types/workspace';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import EditorButton from '../command/EditorButton';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { FileIcons } from './FileList';
import MoreOpate from './MoreOpate';

export const columns: ColumnDef<StoageData>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button className="text-center w-full max-w-[200px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          文件名
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
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button className="text-center w-full max-w-[200px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          文件类型
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="pl-5 max-w-[200px] w-full truncate text-center grid grid-cols-[30px_1fr] justify-center items-center ">
                <span>{FileIcons(row.getValue('type'), 5)}</span>
                <span className="text-xs text-left max-w-[80px] truncate flex gap-1">
                  {row.getValue('type')}
                  {checkIsImage(row.getValue('type')) && (
                    <PhotoProvider>
                      <PhotoView src={row.original.file} key={row.original.file}>
                        <Badge> 图片预览</Badge>
                      </PhotoView>
                    </PhotoProvider>
                  )}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent asChild>
              {/* <PhotoProvider> */}
              {/* {checkIsImage(row.getValue('type')) ? (
                  <PhotoView src={row.original.file} key={row.original.file}>
                    <img
                      src={row.original.file}
                      alt={row.getValue('type')}
                      className='w-[5rem] h-[5rem] object-cover'
                    />
                  </PhotoView>
                ) : ( */}
              {row.getValue('type')}
              {/* )} */}
              {/* </PhotoProvider> */}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'size',
    header: ({ column }) => {
      return (
        <Button className="text-center w-full max-w-[200px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          文件大小
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <EditorButton title={bitToMB(row.getValue('size'))}>
          <div className="max-w-[200px] truncate text-center">{bitToMB(row.getValue('size'))}</div>
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
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button className="text-center w-full max-w-[200px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          更新时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <EditorButton title={dayjs(row.getValue('updated_at')).format('YYYY-MM-DD HH:mm:ss')}>
          <div className="max-w-[200px] truncate text-center">{dayjs(row.getValue('updated_at')).format('YYYY-MM-DD HH:mm:ss')}</div>
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
