import { differenceInDays, format } from 'date-fns';
import styled from 'styled-components';

interface TaskDateProps {
  lastTime: string;
}
const TextColor = styled.span<{ diffInDays: number }>`
  color: ${(props) =>
    props.diffInDays <= 3
      ? 'rgb(255, 0, 0)' // 更鲜艳的红色
      : props.diffInDays <= 7
        ? 'rgb(255, 165, 0)' // 更鲜艳的橙色
        : 'rgb(34, 139, 34)'}; // 更柔和的绿色
`;
const TaskDate = ({ lastTime }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(lastTime);
  const diffInDays = differenceInDays(endDate, today);

  return (
    <TextColor diffInDays={diffInDays || 0} className="text-muted-foreground">
      {format(endDate, 'yyyy-MM-dd')}
    </TextColor>
  );
};

export default TaskDate;
