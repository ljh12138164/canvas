import { useMoveTask } from '@/server/hooks/tasks';
import { TaskStatus, type TaskWithWorkspace } from '@/types/workspace';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type UniqueIdentifier,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { CircleDashedIcon, CircleIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Separator } from '../ui/separator';
import KanbanDrop from './KanbanDrop';
import KanbanItem from './KanbanItem';

const taskStateIcon = {
  [TaskStatus.BACKLOG]: {
    icon: CircleDashedIcon,
    dropColor: 'gray',
    color: 'text-gray-500',
    state: TaskStatus.BACKLOG,
  },
  [TaskStatus.IN_REVIEW]: {
    icon: CircleIcon,
    color: 'text-blue-500',
    dropColor: '#6c7eae',
    state: TaskStatus.IN_REVIEW,
  },
  [TaskStatus.TODO]: {
    icon: CircleIcon,
    color: 'text-green-500',
    dropColor: 'green',
    state: TaskStatus.TODO,
  },
  [TaskStatus.IN_PROGRESS]: {
    icon: CircleIcon,
    color: 'text-yellow-500',
    dropColor: '#c6b87d',
    state: TaskStatus.IN_PROGRESS,
  },
  [TaskStatus.DONE]: {
    icon: CircleIcon,
    color: 'text-red-500',
    dropColor: '#d38686',
    state: TaskStatus.DONE,
  },
};
const KanbanNav = styled.nav`
  display: grid;
  width: 100%;
  overflow-x: auto;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  height: 100%;

  padding: 1rem 0.5rem;

  &::-webkit-scrollbar {
    margin-top: 10px;
    width: 1px;
    background-color: #f0f0f0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    width: 1px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;
const StateItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

const Kanban = ({
  taskList,
  currentUserId,
}: {
  taskList: TaskWithWorkspace[];
  currentUserId: string;
}) => {
  const taskStateList = useMemo(() => {
    return {
      [TaskStatus.TODO]: taskList.filter((task) => task.status === TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: taskList.filter((task) => task.status === TaskStatus.IN_PROGRESS),
      [TaskStatus.DONE]: taskList.filter((task) => task.status === TaskStatus.DONE),
      [TaskStatus.BACKLOG]: taskList.filter((task) => task.status === TaskStatus.BACKLOG),
      [TaskStatus.IN_REVIEW]: taskList.filter((task) => task.status === TaskStatus.IN_REVIEW),
    };
  }, [taskList]);
  const [parent] = useState<UniqueIdentifier | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const queryClient = useQueryClient();
  // 设置乐观更新

  const { moveTask } = useMoveTask();

  const handleDragStart = useMemoizedFn(({ active }) => {
    setActiveId(active.id);
  });

  const handleDragEnd = useMemoizedFn((event: DragEndEvent) => {
    const { over, active } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const activeTask = taskList.find((task) => task.id === active.id);
      const overStatus = over.id as TaskStatus;
      if (overStatus === active.data.current?.task.status || !activeTask) {
        return;
      }
      // 获取旧数据
      const oldData = queryClient.getQueryData<TaskWithWorkspace[]>([
        'taskList',
        activeTask.workspaceId,
        activeTask.projectId,
      ]);
      const newData = oldData?.map((task) =>
        task.id === activeTask.id ? { ...task, status: overStatus } : task,
      );
      // 设置乐观更新
      queryClient.setQueryData(['taskList', activeTask.workspaceId, activeTask.projectId], newData);
      // 更新任务状态
      moveTask(
        {
          json: {
            taskId: activeTask.id,
            currentUserId: currentUserId,
            workspaceId: activeTask.workspaceId,
            projectId: activeTask.projectId,
            position: 1000,
            TaskStatus: overStatus,
          },
        },
        {
          // 错误时
          onError: (error) => {
            console.error(error);
            queryClient.setQueryData(
              ['taskList', activeTask.workspaceId, activeTask.projectId],
              oldData,
            );
          },
        },
      );
    }
  });

  if (!taskList) return null;
  return (
    // DND 上下文
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div style={{ position: 'relative', zIndex: 0 }}>
        {/* 状态栏 */}
        <KanbanNav>
          {Object.entries(taskStateIcon).map(
            ([status, { icon: Icon, color, state, dropColor }]) => (
              <div key={status} style={{ minWidth: '200px', minHeight: '200px' }}>
                {/* 头部状态栏 */}
                <StateItem className="bg-zinc-100 dark:bg-zinc-800">
                  <Icon className={color} />
                  <span>{state}</span>
                  <span>{state !== TaskStatus.ALL && taskStateList[state].length}</span>
                </StateItem>
                <Separator />
                {/* 拖拽区域 */}
                <KanbanDrop
                  status={state}
                  parent={parent}
                  color={dropColor}
                  taskList={state !== TaskStatus.ALL && taskStateList[state]}
                />
              </div>
            ),
          )}
        </KanbanNav>
      </div>
      {/* 拖拽覆盖 */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeId ? (
          <div
            style={{
              position: 'relative',
              zIndex: 999999,
              transformOrigin: '0 0',
              touchAction: 'none',
            }}
          >
            <KanbanItem task={taskList.find((task) => task.id === activeId)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Kanban;
