import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';

import { TaskStatus, TaskWithWorkspace } from '@/types/workspace';
import styled from 'styled-components';
import { ScrollArea } from '../ui/scrollArea';
import KanbanItem from './KanbanItem';

const DropContainer = styled(ScrollArea)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f0f0f0a7;
  height: 300px;
  position: relative;
  z-index: 0;
`;
const DropItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const KanbanDrop = ({
  taskList,
  color,
  parent,
  status,
}: {
  taskList: TaskWithWorkspace[] | false;
  color: string;
  parent: UniqueIdentifier | null;
  status: TaskStatus;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });
  if (!taskList) return null;
  const style = {
    color: isOver ? color : undefined,
  };

  //可拖拽的元素
  return (
    <DropContainer ref={setNodeRef} style={style}>
      {parent === null ? (
        <>
          {taskList.map((task) => (
            <DropItem key={task.id}>
              {/* 拖拽的元素 */}
              <KanbanItem task={task} />
            </DropItem>
          ))}
        </>
      ) : null}
      {taskList.map((item) =>
        parent === item.id ? (
          <>
            {taskList.map((task) => (
              <DropItem key={task.id}>
                {/* 拖拽的元素 */}
                <KanbanItem task={task} />
              </DropItem>
            ))}
          </>
        ) : null
      )}
    </DropContainer>
  );
};

export default KanbanDrop;
