import styled from 'styled-components';
import { Button } from '../ui/button';
import { memo } from 'react';

interface TiptapButton {
  icon: React.ReactNode;
  key: string;
  onClick: () => void;
  active: boolean;
  disabled: boolean;
}
const TiptopButtons = styled(Button)`
  border-radius: 0;
`;
const TiptapButton = ({
  icon,
  onClick,
  active,
  key,
  disabled,
}: TiptapButton) => {
  return (
    <TiptopButtons
      key={key}
      variant='ghost'
      onClick={onClick}
      disabled={!disabled}
      className={active ? 'bg-zinc-100' : ''}
    >
      {icon}
    </TiptopButtons>
  );
};

export default memo(TiptapButton);
