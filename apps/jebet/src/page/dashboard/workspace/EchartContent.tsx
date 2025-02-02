import { LineEchart } from '@/components/echart/LineEchart';
import { PieEchart } from '@/components/echart/PieEchart';
import TaskDate from '@/components/project/TaskDate';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scrollArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspace } from '@/server/hooks/board';
import { TaskStatus } from '@/types/workspace';
import { Activity, Calendar, FileText, Users } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;
const CardContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (width < 1100px) {
    grid-template-columns: 1fr;
  }
`;
const StatsCard = styled(Card)`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color}20;
  color: ${(props) => props.color};
`;

const StatsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatsValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const StatsLabel = styled.div`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonCard = styled(Card)`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SkeletonIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
`;

const SkeletonText = styled.div`
  width: 100px;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
`;

const SkeletonValue = styled(SkeletonText)`
  width: 60px;
  height: 24px;
  margin-bottom: 8px;
`;
const InfoContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const TaskCount = styled(Card)`
  padding: 1rem;
  justify-content: center;
  min-height: 100px;
`;
const TaskItem = styled.section`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
`;
const ProjectContainer = styled.section`
  width: 100%;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const EchartContent = ({
  id,
  workspaceId,
}: {
  id: string;
  workspaceId: string;
}) => {
  const { data: workspace, isLoading, isFetching } = useWorkspace(id);
  const [showMore, setShowMore] = useState(false);
  const [date, setDate] = useState(7);

  const navigator = useNavigate();
  if (isLoading || isFetching) {
    return (
      <Container>
        <StatsGrid>
          {Array.from({ length: 4 }).map((_) => (
            <SkeletonCard key={nanoid()}>
              <SkeletonIcon />
              <StatsInfo>
                <SkeletonValue />
                <SkeletonText />
              </StatsInfo>
            </SkeletonCard>
          ))}
        </StatsGrid>
        <ChartsGrid>
          <Skeleton className="h-full w-full" />
        </ChartsGrid>
      </Container>
    );
  }
  const workspaces = workspace?.find((item) => item.id === workspaceId);
  if (!workspaces) {
    navigator('/dashboard/home');
    return null;
  }
  const finshTask = workspaces.tasks.filter((item) => item.status === TaskStatus.DONE);
  return (
    <Container>
      <StatsGrid>
        <StatsCard>
          <IconWrapper color="#3B82F6">
            <Users size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>{workspaces.member.length}</StatsValue>
            <StatsLabel>总用户数</StatsLabel>
          </StatsInfo>
        </StatsCard>

        <StatsCard>
          <IconWrapper color="#6366F1">
            <FileText size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>{workspaces?.projects.length}</StatsValue>
            <StatsLabel>总项目数</StatsLabel>
          </StatsInfo>
        </StatsCard>

        <StatsCard>
          <IconWrapper color="#10B981">
            <Activity size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>{workspaces?.tasks.length}</StatsValue>
            <StatsLabel>总任务数</StatsLabel>
          </StatsInfo>
        </StatsCard>

        <StatsCard>
          <IconWrapper color="#F59E0B">
            <Calendar size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>
              {Number.isNaN((finshTask.length / workspaces.tasks.length) * 100)
                ? 0
                : (finshTask.length / workspaces.tasks.length) * 100}
              %
            </StatsValue>
            <StatsLabel>完成率</StatsLabel>
          </StatsInfo>
        </StatsCard>
      </StatsGrid>
      {/* 任务数 */}
      <CardContainer>
        <TaskCount className="">
          <p className="text-xl text-muted-foreground font-bold">
            任务数({workspaces.tasks.length})
          </p>
          <Separator className="h-[1px] mb-2" />
          <ScrollArea className="max-h-[300px]">
            {workspaces.tasks.length > 0 && (
              <section>
                {showMore
                  ? workspaces.tasks.map((item) => (
                      <TaskItem
                        key={item.id}
                        className="bg-[#fff]  dark:bg-black cursor-pointer"
                        onClick={() =>
                          navigator(`/dashboard/${workspaceId}/${item.projectId}/home/${item.id}`)
                        }
                      >
                        <p className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Badge variant={item.status}>{item.status}</Badge> -
                            <span className="flex items-center gap-1">
                              <Calendar />
                              <TaskDate lastTime={item.lastTime} />
                            </span>
                          </span>
                        </p>
                      </TaskItem>
                    ))
                  : workspaces.tasks.slice(0, 2).map((item) => (
                      <TaskItem
                        key={item.id}
                        className="bg-[#fff]  dark:bg-black cursor-pointer"
                        onClick={() =>
                          navigator(`/dashboard/${workspaceId}/${item.projectId}/home/${item.id}`)
                        }
                      >
                        <p className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Badge variant={item.status}>{item.status}</Badge> -
                            <span className="flex items-center gap-1">
                              <Calendar />
                              <TaskDate lastTime={item.lastTime} />
                            </span>
                          </span>
                        </p>
                      </TaskItem>
                    ))}
              </section>
            )}
            {workspaces.tasks.length === 0 && <p className="text-center h-full">无数据</p>}
          </ScrollArea>
          {workspaces.tasks.length > 2 && (
            <Button onClick={() => setShowMore(!showMore)} variant="outline" className="w-full">
              {showMore ? '收起' : '查看更多'}
            </Button>
          )}
        </TaskCount>
        {/* 项目 */}
        <TaskCount className="bg-[#fff] dark:bg-black">
          <p className="text-xl text-muted-foreground font-bold">
            项目({workspaces.projects.length})
          </p>
          <Separator className="h-[1px] mb-2" />
          <ScrollArea className="max-h-[300px]">
            {workspaces.projects.length > 0 && (
              <ProjectContainer>
                {workspaces.projects.map((item) => (
                  <TaskItem
                    key={item.id}
                    className="bg-[#fff]  dark:bg-black cursor-pointer flex gap-2 items-center"
                    onClick={() => navigator(`/dashboard/${workspaceId}/${item.id}`)}
                  >
                    <Avatar>
                      <AvatarImage src={item.imageUrl} />
                      <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p>{item.name}</p>
                  </TaskItem>
                ))}
              </ProjectContainer>
            )}
            {workspaces.projects.length === 0 && <p className="text-center h-full">无数据</p>}
          </ScrollArea>
        </TaskCount>
        {/* 成员 */}
        <TaskCount className="bg-[#fff] dark:bg-black">
          <p className="text-xl text-muted-foreground font-bold">
            成员({workspaces.member.length})
          </p>
          <Separator className="h-[1px] mb-2" />
          <ScrollArea className="max-h-[300px]">
            {workspaces.member.length > 0 && (
              <ProjectContainer>
                {workspaces.member.map((item) => (
                  <TaskItem
                    key={item.id}
                    className="bg-[#fff]  dark:bg-black cursor-pointer flex gap-2 items-center justify-center flex-col"
                  >
                    <Avatar>
                      <AvatarImage src={item.userImage} />
                      <AvatarFallback>{item.username}</AvatarFallback>
                    </Avatar>
                    <InfoContainer>
                      <p>{item.username}</p>
                      <p>{item.email}</p>
                    </InfoContainer>
                  </TaskItem>
                ))}
              </ProjectContainer>
            )}
            {workspaces.member.length === 0 && <p className="text-center h-full">无数据</p>}
          </ScrollArea>
        </TaskCount>
        {/* 工作流 */}
        <TaskCount className="bg-[#fff] dark:bg-black">
          <p className="text-xl text-muted-foreground font-bold">
            工作流({workspaces.flow.length})
          </p>
          <Separator className="h-[1px] mb-2" />
          {workspaces.flow.length > 0 && (
            <ScrollArea className="">
              <ProjectContainer>
                {workspaces.flow.map((item) => (
                  <TaskItem
                    key={item.id}
                    className="bg-[#fff]  dark:bg-black cursor-pointer flex gap-2 items-center justify-center flex-col"
                    onClick={() => navigator(`/dashboard/${workspaceId}/flow/detail/${item.id}`)}
                  >
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <p className="flex items-center gap-2">
                      创建人：
                      {workspaces.member.map((members) => {
                        if (item.userId === members.userId) return <>{members.username}</>;
                      })}
                    </p>
                  </TaskItem>
                ))}
              </ProjectContainer>
            </ScrollArea>
          )}
          {workspaces.flow.length === 0 && <p className="text-center h-full">无数据</p>}
        </TaskCount>
      </CardContainer>
      {/* Echart */}
      {workspaces && workspaces.tasks.length > 0 && (
        <>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">任务数</div>
            <Select value={date.toString()} onValueChange={(value) => setDate(Number(value))}>
              <SelectTrigger className="ml-auto w-[30%]">
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7天</SelectItem>
                <SelectItem value="14">14天</SelectItem>
                <SelectItem value="30">30天</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ChartsGrid>
            <LineEchart date={date} workspace={workspaces} types="tasks" />
            <PieEchart date={date} workspace={workspaces} types="tasks" />
          </ChartsGrid>
        </>
      )}
    </Container>
  );
};

export default EchartContent;
