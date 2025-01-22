import { Button } from '@/components/ui/button';
import type { TaskWithWorkspace } from '@/types/workspace';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import styled from 'styled-components';
import { Badge } from '../ui/badge';
import ProjectOpacte from './ProjectOpacte';
import TaskDate from './TaskDate';
const MemberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const MemberAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
export const columns: ColumnDef<TaskWithWorkspace>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          名称
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="line-clamp-1">{row.original.name}</p>;
    },
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          指派人
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const member = row.original.workspace.member.find(
        (item) => item.userId === row.original.assigneeId,
      );
      return (
        <MemberContainer className="line-clamp-1">
          <MemberAvatar src={member?.userImage} alt={member?.username} />
          {member?.username}
        </MemberContainer>
      );
    },
  },
  {
    accessorKey: 'lastTime',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          结束时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <MemberContainer className="line-clamp-1">
          <TaskDate lastTime={row.original.lastTime} />
        </MemberContainer>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          状态
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <MemberContainer className="line-clamp-1">
          <Badge variant={row.original.status}>{row.original.status}</Badge>
        </MemberContainer>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          状态
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        // @ts-ignore
        <Badge variant={row.original.priority}>{row.original.priority}</Badge>
      );
    },
  },
  {
    accessorKey: '操作',
    cell: ({ row }) => {
      return <ProjectOpacte type="list" task={row.original} />;
    },
  },
];
