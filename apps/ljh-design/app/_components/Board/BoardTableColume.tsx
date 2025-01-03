"use client";
import { ColumnDef } from "@tanstack/react-table";
import { BoardData } from "../../_types/board";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./BoardTableColumnHeader";
export const columns: ColumnDef<BoardData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader title="面板名字" column={column} />;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <DataTableColumnHeader title="创建时间" column={column} />;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return <DataTableColumnHeader title="更新时间" column={column} />;
    },
  },
  {
    id: "actions",
    header: () => {
      return <div>操作</div>;
    },
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">打开菜单</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              复制ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>编辑</DropdownMenuItem>
            <DropdownMenuItem>删除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
