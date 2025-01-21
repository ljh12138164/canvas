import { type Member, type Project, TaskStatus, type Workspace } from '@/types/workspace';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface EvenetCardProps {
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    project: Project;
    workspace: Workspace & {
      member: Member[];
    };
    status: TaskStatus;
    assignee: string;
  };
}

// 状态样式映射表
const STATUS_STYLES: Record<TaskStatus, { backgroundColor: string; color: string; label: string }> = {
  [TaskStatus.TODO]: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    label: '待处理',
  },
  [TaskStatus.IN_PROGRESS]: {
    backgroundColor: '#DBEAFE',
    color: '#2563EB',
    label: '进行中',
  },
  [TaskStatus.DONE]: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
    label: '已完成',
  },
  [TaskStatus.ALL]: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    label: '全部',
  },
  [TaskStatus.IN_REVIEW]: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    label: '等待审核',
  },
  [TaskStatus.BACKLOG]: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    label: '待办',
  },
};

// 样式组件
const CardWrapper = styled.div`
  padding: 0.25rem;
  background: white;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
  margin: 2px;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const ProjectDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
`;

interface StatusBadgeProps {
  $backgroundColor: string;
  $textColor: string;
}

const StatusBadge = styled.span<StatusBadgeProps>`
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$textColor};
`;

export const EventCard = ({ event }: EvenetCardProps) => {
  // 获取负责人信息
  const assignee = event.workspace.member.find((member) => member.id === event.assignee);
  // 跳转
  const navigate = useNavigate();

  // 获取状态样式
  const statusStyle = STATUS_STYLES[event.status];

  return (
    <CardWrapper onClick={() => navigate(`/dashboard/${event.workspace.id}/${event.project.id}/home/${event.id}`)}>
      {/* 任务标题 */}
      <Title>{event?.title}</Title>

      {/* 项目信息 */}
      <InfoRow>
        <ProjectDot />
        <span>{event?.project?.name}</span>
      </InfoRow>

      {/* 负责人 */}
      {assignee && (
        <InfoRow>
          <span>负责人: {assignee?.username}</span>
        </InfoRow>
      )}

      {/* 状态标签 */}
      <InfoRow>
        <StatusBadge $backgroundColor={statusStyle.backgroundColor} $textColor={statusStyle.color}>
          {statusStyle.label}
        </StatusBadge>
      </InfoRow>
    </CardWrapper>
  );
};
