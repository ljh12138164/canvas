import type { Board } from '@/app/_types/board';
import dayjs from 'dayjs';
import { Copy } from 'lucide-react';
import Image from 'next/image';
import { CiFileOn } from 'react-icons/ci';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import TooltipComponents from '../Comand/Tooltip';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { TableCell } from '../ui/table';
import { BoardCopy } from './BoardCopy';
import BoardDelete from './BoardDelete';
import BoardEdit from './BoardEdit';
const BoardItem = ({
  board,
  setChange,
  userId,
}: {
  board: Board;
  setChange?: (change: boolean) => void;
  userId?: string;
}) => {
  return (
    <>
      <TableCell
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center gap-1 max-w-[100px] text-ellipsis ">
          <TooltipComponents label={board.name || ''}>
            <PhotoProvider>
              <PhotoView src={board.image || ''}>
                <Image
                  src={board.image || ''}
                  alt={board.name || ''}
                  width={50}
                  height={50}
                  className="w-10 h-10 rounded-md border-2 border-gray-600"
                />
              </PhotoView>
            </PhotoProvider>
          </TooltipComponents>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 max-w-[100px] text-ellipsis ">
          <CiFileOn className="size-8 min-w-[2rem]" />
          <TooltipComponents label={board.name || ''}>
            <span className="text-ellipsis block overflow-hidden ">{board.name}</span>
          </TooltipComponents>
        </div>
      </TableCell>
      <TableCell className="max-w-[100px] text-ellipsis">
        <TooltipComponents align="start" label={`${board.width}x${board.height}`}>
          <span className="text-ellipsis block overflow-hidden">
            {board.width}x{board.height}
            <span className="ml-1">px</span>
          </span>
        </TooltipComponents>
      </TableCell>
      <TableCell className="max-w-[100px] text-ellipsis">
        <TooltipComponents
          align="start"
          label={board.created_at ? new Date(board.created_at).toLocaleString() : ''}
        >
          <span className="text-ellipsis block overflow-hidden">
            {dayjs(board.created_at).format('MM-DD HH:mm')}
          </span>
        </TooltipComponents>
      </TableCell>
      <TableCell className="text-ellipsis">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IoMenu className="size-6 cursor-pointer hover:text-blue-700 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-2 w-full">
            <BoardEdit setChange={setChange} userId={userId} data={board} id={board.id}>
              <Button
                variant="ghost"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FaRegEdit className="mr-2 size-4" />
                <span>编辑</span>
              </Button>
            </BoardEdit>
            <BoardCopy userId={userId} board={board} setChange={setChange}>
              <Button
                variant="ghost"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Copy className="mr-2 size-4" />
                <span>复制</span>
              </Button>
            </BoardCopy>
            <BoardDelete setChange={setChange} id={board.id} board={board} userId={userId}>
              <Button
                variant="ghost"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FaRegTrashAlt className="mr-2 size-4" />
                <span>删除</span>
              </Button>
            </BoardDelete>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </>
  );
};

export default BoardItem;
