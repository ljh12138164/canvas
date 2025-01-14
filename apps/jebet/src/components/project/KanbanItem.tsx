import { TaskWithWorkspace } from "@/types/workspace";
import { useMemo } from "react";
import styled from "styled-components";
import { Separator } from "../ui/separator";
import ProjectOpacte from "./ProjectOpacte";
import { MoveLeft } from "lucide-react";
import TaskDate from "./TaskDate";
import { useDraggable } from "@dnd-kit/core";

const StatusIndicator = styled.div<{ status: string }>`
  width: 4px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: ${(props) => {
    switch (props.status) {
      case "STORAGE":
        return "#808080";
      case "PENDING":
        return "#3B82F6";
      case "TODO":
        return "#10B981";
      case "DOING":
        return "#F59E0B";
      case "DONE":
        return "#EF4444";
      default:
        return "#808080";
    }
  }};
`;

const TaskItem = styled.div<{ isDragging?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: start;
  background-color: #fff;
  margin: 5px;
  position: ${(props) => (props.isDragging ? "absolute" : "relative")};
  border-radius: 6px;
  box-shadow: ${(props) =>
    props.isDragging
      ? "0 5px 15px rgba(0,0,0,0.25)"
      : "0 1px 3px rgba(0,0,0,0.1)"};
  z-index: ${(props) => (props.isDragging ? 1000 : 1)};
  pointer-events: ${(props) => (props.isDragging ? "none" : "auto")};
  width: ${(props) => (props.isDragging ? "15rem" : "100%")};
  cursor: grab;
  transform-origin: 0 0;

  &:active {
    cursor: grabbing;
  }
`;
const TaskMessage = styled.nav`
  height: 30px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-basis: 30px;
  padding: 0 0 0 10px;
  display: flex;
`;
const TaskMember = styled.section`
  width: 100%;
  height: 30px;
  flex-basis: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
`;

const TaskImage = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
`;

const TaskImageFallback = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;
`;

const KanbanItem = ({ task }: { task: TaskWithWorkspace }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        task,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.05)`,
        opacity: 1,
      }
    : undefined;

  const assigneeMemeber = useMemo(() => {
    return task.workspace.member.find((m) => m.userId === task.assigneeId);
  }, [task.workspace.member, task.assigneeId]);
  return (
    <TaskItem
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      isDragging={isDragging}
    >
      <StatusIndicator status={task.status} />
      <TaskMessage>
        <span>{task.name}</span>
        <span>
          <ProjectOpacte type="kanban" task={task}></ProjectOpacte>
        </span>
      </TaskMessage>
      <Separator className="mb-1 border-[1.5px]" />
      <TaskMember>
        {assigneeMemeber?.userImage ? (
          <TaskImage
            src={assigneeMemeber.userImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/default-avatar.png";
            }}
          />
        ) : (
          <TaskImageFallback>
            {assigneeMemeber?.username || "?"}
          </TaskImageFallback>
        )}
        <MoveLeft className="w-4 h-4" />
        <TaskDate lastTime={task.lastTime} />
      </TaskMember>
    </TaskItem>
  );
};

export default KanbanItem;
