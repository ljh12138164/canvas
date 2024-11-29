import { TaskWithWorkspace } from "@/types/workspace";
import { useMemo } from "react";
import styled from "styled-components";
import { Separator } from "../ui/separator";
import ProjectOpacte from "./ProjectOpacte";
import { MoveLeft } from "lucide-react";
import TaskDate from "./TaskDate";

const TaskItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  background-color: #fff;
  margin: 5px;
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
const KanbanItem = ({ task }: { task: TaskWithWorkspace }) => {
  const assigneeMemeber = useMemo(() => {
    return task.workspace.member.find((m) => m.userId === task.assigneeId);
  }, [task.workspace.member, task.assigneeId]);
  console.log(task);
  return (
    <TaskItem>
      <TaskMessage>
        <span>{task.name}</span>
        <span>
          <ProjectOpacte type="kanban" task={task}></ProjectOpacte>
        </span>
      </TaskMessage>
      <Separator className="mb-1 border-[1.5px]" />
      <TaskMember>
        <TaskImage src={assigneeMemeber?.userImage} />
        <MoveLeft className="w-4 h-4" />
        <TaskDate lastTime={task.lastTime} />
      </TaskMember>
    </TaskItem>
  );
};

export default KanbanItem;
