import { LineEchart } from '@/components/echart/LineEchart';
import { PieEchart } from '@/components/echart/PieEchart';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspace } from '@/server/hooks/board';
import { TaskStatus } from '@/types/workspace';
import { Activity, Calendar, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
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

const EchartContent = ({
  id,
  workspaceId,
}: {
  id: string;
  workspaceId: string;
}) => {
  const { data: workspace, isLoading } = useWorkspace(id);

  const [date, setDate] = useState(7);

  const navigator = useNavigate();
  if (isLoading) {
    return (
      <Container>
        <StatsGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index}>
              <SkeletonIcon />
              <StatsInfo>
                <SkeletonValue />
                <SkeletonText />
              </StatsInfo>
            </SkeletonCard>
          ))}
        </StatsGrid>
        <ChartsGrid>
          <Skeleton className='h-full w-full' />
        </ChartsGrid>
      </Container>
    );
  }
  const workspaces = workspace?.find((item) => item.id === workspaceId);
  if (!workspaces) {
    toast.error('工作区不存在');
    navigator('/dashboard/home');
    return null;
  }
  const finshTask = workspaces.tasks.filter(
    (item) => item.status === TaskStatus.DONE
  );
  return (
    <Container>
      <StatsGrid>
        <StatsCard>
          <IconWrapper color='#3B82F6'>
            <Users size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>{workspaces.member.length}</StatsValue>
            <StatsLabel>总用户数</StatsLabel>
          </StatsInfo>
        </StatsCard>

        <StatsCard>
          <IconWrapper color='#6366F1'>
            <FileText size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>{workspaces?.projects.length}</StatsValue>
            <StatsLabel>总项目数</StatsLabel>
          </StatsInfo>
        </StatsCard>

        <StatsCard>
          <IconWrapper color='#10B981'>
            <Activity size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>{workspaces?.tasks.length}</StatsValue>
            <StatsLabel>总任务数</StatsLabel>
          </StatsInfo>
        </StatsCard>

        <StatsCard>
          <IconWrapper color='#F59E0B'>
            <Calendar size={24} />
          </IconWrapper>
          <StatsInfo>
            <StatsValue>
              {((finshTask.length / workspaces.tasks.length) * 100).toFixed(2)}%
            </StatsValue>
            <StatsLabel>完成率</StatsLabel>
          </StatsInfo>
        </StatsCard>
      </StatsGrid>
      {/* Echart */}
      <div className='flex gap-4'>
        <div className='flex items-center gap-2'>任务数</div>
        <Select
          value={date.toString()}
          onValueChange={(value) => setDate(Number(value))}
        >
          <SelectTrigger className='ml-auto w-[30%]'>
            <SelectValue placeholder='请选择' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='7'>7天</SelectItem>
            <SelectItem value='14'>14天</SelectItem>
            <SelectItem value='30'>30天</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartsGrid>
        <LineEchart date={date} workspace={workspaces} types='tasks' />
        <PieEchart date={date} workspace={workspaces} types='tasks' />
      </ChartsGrid>
    </Container>
  );
};

export default EchartContent;
