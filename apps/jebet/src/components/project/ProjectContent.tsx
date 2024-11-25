import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scrollArea";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import TaskFromCard from "./TaskFromCard";
import { useGetJebtUserList } from "@/server/hooks/user";
import { UserResource } from "@clerk/types";
const ProjectContentContainer = styled(Card)`
  flex: 1;
  padding: 10px;
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
  const [selectTap, setSelectTap] = useState<SelectTap>(() => {
    const select = searchParams.get("select");
    if (select && Object.keys(SelectTaps).includes(select))
      return select as SelectTap;
    return "task";
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
        {/* TODO: 根据不同的selectTap显示不同的内容 */}
        <div>data filter</div>
        <div>data {selectTap}</div>
      </ProjectScrollArea>
    </ProjectContentContainer>
  );
};
export default ProjectContent;
