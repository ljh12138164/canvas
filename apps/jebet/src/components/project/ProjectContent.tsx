import { useGetTaskList } from "@/server/hooks/tasks";
import { useGetJebtUserList } from "@/server/hooks/user";
import { TaskStatus } from "@/types/workspace";
import { UserResource } from "@clerk/types";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { FiPlus } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";
import { DataTable } from "../ui/date-table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import TaskFromCard from "./TaskFromCard";
import { columns } from "./Table";
const animate = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`;
const ProjectContentContainer = styled(Card)`
  flex: 1;
  padding: 20px;
  z-index: 0;
  animation: ${animate} 0.4s ease-in-out;
`;
const ProjectNavContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: "#e5e7eba0";
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProjectNav = styled.nav`
  height: 6dvh;
`;
const ProjectScrollArea = styled(ScrollArea)`
  height: 60dvh;
  padding: 1rem 0 0 0;
`;
const PlusButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;
type SelectTap = "kanban" | "task" | "calendar";
const SelectTaps = {
  task: "工作区",
  calendar: "日历",
  kanban: "看板",
};
const Container = styled.div`
  width: 100%;
  overflow: hidden;
`;
const SelectConatiner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProjectContent = ({
  workspaceId,
  projectId,
  userData,
}: {
  workspaceId: string;
  projectId: string;
  userData: UserResource;
}) => {
  const { data: memberData, isLoading } = useGetJebtUserList({
    workspaceId,
    userId: userData?.id,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useQueryClient();
  const [assigneeId, setAssigneeId] = useState<string | undefined>();
  const [date, setDate] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.ALL);
  const [selectTap, setSelectTap] = useState<SelectTap>(() => {
    const select = searchParams.get("select");
    if (select && Object.keys(SelectTaps).includes(select))
      return select as SelectTap;
    return "task";
  });
  const {
    // TODO: 数据渲染
    data: taskList,
    isLoading: taskListLoading,
    isFetching: taskListFetching,
  } = useGetTaskList({
    workspaceId,
    projectId,
    currentUserId: userData.id,
    lastTime: date,
    status: status === TaskStatus.ALL ? undefined : status,
    assigneeId: assigneeId === "全部" ? undefined : assigneeId,
  });
  useEffect(() => {
    const select = searchParams.get("select");
    if (!select || !Object.keys(SelectTaps).includes(select)) {
      searchParams.set("select", "task");
      setSearchParams(searchParams);
      setSelectTap("task");
    }
  }, [selectTap, searchParams, setSearchParams]);
  if (isLoading) return <div>加载</div>;
  return (
    <ProjectContentContainer>
      <ProjectNav>
        <ProjectNavContainer>
          <Tabs defaultValue={selectTap}>
            <TabsList>
              {Object.keys(SelectTaps).map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  onClick={() => {
                    searchParams.set("select", key);
                    setSearchParams(searchParams);
                    setSelectTap(key as SelectTap);
                  }}
                >
                  {SelectTaps[key as SelectTap]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <TaskFromCard
            currentUserId={userData.id}
            type="create"
            workspaceId={workspaceId}
            projectId={projectId}
            userData={memberData?.data}
          >
            <PlusButton>
              <FiPlus />
              <span>添加</span>
            </PlusButton>
          </TaskFromCard>
        </ProjectNavContainer>
        <Separator className="my-2" />
      </ProjectNav>
      <ProjectScrollArea>
        <header>分类</header>
        <SelectConatiner>
          <Select
            value={status}
            onValueChange={(value) => {
              if (taskListFetching) return;
              flushSync(() => {
                setStatus(value as TaskStatus);
              });
              query.invalidateQueries({
                queryKey: ["taskList"],
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskStatus).map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className={
                    taskListFetching ? "opacity-50 cursor-not-allowed" : ""
                  }
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={assigneeId || "全部"}
            onValueChange={(value) => {
              if (taskListFetching) return;
              flushSync(() => {
                setAssigneeId(value);
              });
              query.invalidateQueries({
                queryKey: ["taskList"],
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择负责人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="全部"
                className={
                  taskListFetching ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                所有人
              </SelectItem>
              {memberData?.data?.map((member) => (
                <SelectItem
                  className={
                    taskListFetching ? "opacity-50 cursor-not-allowed" : ""
                  }
                  key={member.id}
                  value={member.userId}
                >
                  {member.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full px-2 h-8 border border-input bg-background shadow-sm ">
                <div className="flex items-center gap-2">
                  <CalendarIcon className=" h-4 w-4 opacity-50" />
                  {date ? (
                    format(date, "yyyy-MM-dd")
                  ) : (
                    <span className="text-xs">请选择最后时间</span>
                  )}
                  {date && (
                    <XIcon
                      className="ml-auto h-6 w-6 opacity-50 z-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        flushSync(() => {
                          setDate(undefined);
                        });
                        query.invalidateQueries({
                          queryKey: ["taskList"],
                        });
                      }}
                    />
                  )}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                className={
                  taskListFetching ? "opacity-50 cursor-not-allowed" : ""
                }
                selected={date ? new Date(date) : undefined}
                onSelect={(date) => {
                  if (taskListFetching) return;
                  if (date) {
                    flushSync(() => {
                      setDate(format(date, "yyyy-MM-dd"));
                    });
                    query.invalidateQueries({
                      queryKey: ["taskList"],
                    });
                  }
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </SelectConatiner>

        <Separator className="my-2" />
        {!taskListLoading ? (
          <Container>
            {selectTap === "task" && (
              <div className={taskListFetching ? "opacity-50" : ""}>
                <DataTable columns={columns} data={taskList || []} />
              </div>
            )}
            {selectTap === "calendar" && <div>日历</div>}
            {selectTap === "kanban" && <div>看板</div>}
          </Container>
        ) : (
          <div>加载中</div>
        )}
      </ProjectScrollArea>
    </ProjectContentContainer>
  );
};
export default ProjectContent;
