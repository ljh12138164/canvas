import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { TaskStatus, TaskWithWorkspace } from "@/types/workspace";
import styled from "styled-components";
import { ScrollArea } from "../ui/scrollArea";
import KanbanItem from "./KanbanItem";

const DropContainer = styled(ScrollArea)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 300px;
  position: relative;
  z-index: 1;
  overflow: visible;
`;
const DropItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

const KanbanDrop = ({
  taskList,
  color,
  // parent,
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
    <DropContainer
      ref={setNodeRef}
      style={style}
      className="bg-zinc-100 dark:bg-zinc-900"
    >
      {/* 任务列表 */}
      {taskList.map((task) => (
        <DropItem key={task.id}>
          <KanbanItem task={task} />
        </DropItem>
      ))}
    </DropContainer>
  );
};

export default KanbanDrop;
