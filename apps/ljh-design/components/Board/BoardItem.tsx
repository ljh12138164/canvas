import { BoardResponse } from '@/types/board';
import dayjs from 'dayjs';
import { CiFileOn } from 'react-icons/ci';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import TooltipComponents from '../shadui-Components/Tooltip';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { TableCell } from '../ui/table';
import BoardEdit from './BoardEdit';
import BoardDelete from './BoardDelete';
const BoardItem = ({
  board,
  userId,
}: {
  board: BoardResponse;
  userId: string;
}) => {
  return (
    <>
      <TableCell>
        <div className="flex items-center gap-1 max-w-[100px] text-ellipsis ">
          <CiFileOn className="size-8 min-w-[2rem]" />
          <TooltipComponents label={board.name}>
            <span className="text-ellipsis block overflow-hidden ">
              {board.name}
            </span>
          </TooltipComponents>
        </div>
      </TableCell>
      <TableCell className="max-w-[100px] text-ellipsis">
        <TooltipComponents
          align="start"
          label={board.width + 'x' + board.height}
        >
          <span className="text-ellipsis block overflow-hidden">
            {board.width}x{board.height}
            <span className="ml-1">px</span>
          </span>
        </TooltipComponents>
      </TableCell>
      <TableCell className="max-w-[100px] text-ellipsis">
        <TooltipComponents
          align="start"
          label={new Date(board.created_at).toLocaleString()}
        >
          <span className="text-ellipsis block overflow-hidden">
            {dayjs(board.created_at).format('MM-DD HH:mm')}
          </span>
        </TooltipComponents>
      </TableCell>
      <TableCell className="text-ellipsis">
        {/* @ts-ignore */}
        <DropdownMenu>
          {/* @ts-ignore */}
          <DropdownMenuTrigger asChild>
            <IoMenu className="size-6 cursor-pointer hover:text-blue-700 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-2 w-full">
            <BoardEdit userId={userId} data={board} id={board.id}>
              <Button
                variant="ghost"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FaRegEdit className="mr-2 size-4 " />
                <span>编辑</span>
              </Button>
            </BoardEdit>
            <BoardDelete id={board.id} board={board} userId={userId}>
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
