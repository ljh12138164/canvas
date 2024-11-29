import { TaskStatus, TaskWithWorkspace } from "@/types/workspace";
import { CircleDashedIcon, CircleIcon } from "lucide-react";
import { useMemo } from "react";
import styled from "styled-components";
import { Separator } from "../ui/separator";
import KanbanDrop from "./KanbanDrop";

const taskStateIcon = {
  [TaskStatus.BACKLOG]: {
    icon: CircleDashedIcon,
    dropColor: "gray",
    color: "text-gray-500",
    state: TaskStatus.BACKLOG,
  },
  [TaskStatus.IN_REVIEW]: {
    icon: CircleIcon,
    color: "text-blue-500",
    dropColor: "#6c7eae",
    state: TaskStatus.IN_REVIEW,
  },
  [TaskStatus.TODO]: {
    icon: CircleIcon,
    color: "text-green-500",
    dropColor: "green",
    state: TaskStatus.TODO,
  },
  [TaskStatus.IN_PROGRESS]: {
    icon: CircleIcon,
    color: "text-yellow-500",
    dropColor: "#c6b87d",
    state: TaskStatus.IN_PROGRESS,
  },
  [TaskStatus.DONE]: {
    icon: CircleIcon,
    color: "text-red-500",
    dropColor: "#d38686",
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
const Kanban = ({ taskList }: { taskList: TaskWithWorkspace[] }) => {
  const taskStateList = useMemo(() => {
    return {
      [TaskStatus.TODO]: taskList.filter(
        (task) => task.status === TaskStatus.TODO
      ),
      [TaskStatus.IN_PROGRESS]: taskList.filter(
        (task) => task.status === TaskStatus.IN_PROGRESS
      ),
      [TaskStatus.DONE]: taskList.filter(
        (task) => task.status === TaskStatus.DONE
      ),
      [TaskStatus.BACKLOG]: taskList.filter(
        (task) => task.status === TaskStatus.BACKLOG
      ),
      [TaskStatus.IN_REVIEW]: taskList.filter(
        (task) => task.status === TaskStatus.IN_REVIEW
      ),
    };
  }, [taskList]);
  console.log(taskStateList);
  return (
    <KanbanNav>
      {Object.entries(taskStateIcon).map(
        ([status, { icon: Icon, color, state, dropColor }]) => (
          <div style={{ minWidth: "200px", minHeight: "200px" }}>
            <StateItem key={status}>
              <Icon className={color} />
              <span>{state}</span>
              <span>
                {state !== TaskStatus.ALL && taskStateList[state].length}
              </span>
            </StateItem>
            <Separator />
            <KanbanDrop
              color={dropColor}
              taskList={state !== TaskStatus.ALL && taskStateList[state]}
            />
          </div>
        )
      )}
    </KanbanNav>
  );
};

export default Kanban;
