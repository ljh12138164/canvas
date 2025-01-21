import { memo } from 'react';
import styled from 'styled-components';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TiptapButton {
  icon: React.ReactNode;
  key: string;
  onClick: () => void;
  active: boolean;
  disabled: boolean;
  title: string;
}
const TiptopButtons = styled(Button)`
  border-radius: 0;
  width: 32px;
  height: 100%;
`;
const TiptapButton = ({ icon, onClick, active, key, disabled, title }: TiptapButton) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TiptopButtons key={key + title} variant="ghost" onClick={onClick} disabled={!disabled} className={active ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}>
            {icon}
          </TiptopButtons>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(TiptapButton);
