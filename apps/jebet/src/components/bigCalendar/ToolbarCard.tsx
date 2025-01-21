import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

interface ToolbarCardProps {
  onNavigator: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  data: Date;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TodayButton = styled(Button)`
  margin-left: 0.5rem;
`;

const DateText = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
`;

export const ToolbarCard = ({ onNavigator, data }: ToolbarCardProps) => {
  return (
    <Container>
      <ButtonGroup>
        <Button variant="outline" size="icon" onClick={() => onNavigator('PREV')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={() => onNavigator('NEXT')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <TodayButton variant="outline" onClick={() => onNavigator('TODAY')}>
          今天
        </TodayButton>
      </ButtonGroup>
      <DateText>{format(data, 'yyyy年MM月', { locale: zhCN })}</DateText>
    </Container>
  );
};
