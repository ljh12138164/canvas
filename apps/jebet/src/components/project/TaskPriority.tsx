import { TasksPriority } from '@/types/workspace';

interface TaskPriorityProps {
  priority: TasksPriority;
}
const taskTitle: Record<TasksPriority, { title: string; color: string }> = {
  [TasksPriority.IMPORTANT]: { title: '重要', color: 'rgb(255, 75, 75)' },
  [TasksPriority.GENERAL]: { title: '一般', color: 'rgb(255, 152, 0)' },
  [TasksPriority.SUGGESTION]: { title: '建议', color: 'rgb(180, 175, 10)' },
  [TasksPriority.ALL]: { title: '全部', color: 'rgb(180, 175, 10)' },
  [TasksPriority.URGENT]: { title: '紧急', color: 'rgb(255, 75, 75)' },
};

const TaskPriority = ({ priority }: TaskPriorityProps) => {
  return (
    <p style={{ color: taskTitle[priority].color }}>
      {taskTitle[priority].title}
    </p>
  );
};

export default TaskPriority;
