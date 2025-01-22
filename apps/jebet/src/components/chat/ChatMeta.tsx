import chatStore from '@/store/chat';
import type { Workspace } from '@/types/workspace';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Badge } from '../ui/badge';
const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 100px;
  border-bottom: 1px solid #e2e8f0;
`;
const ConnectedContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;
interface ChatMetaProps {
  isConnected: boolean;
  workspace: Workspace;
}
const ChatMeta = observer(({ workspace }: ChatMetaProps) => {
  const { connectCount, socket } = chatStore;
  return (
    <HeaderContainer>
      {socket && (
        <p className="text-sm text-muted-foreground whitespace-nowrap">在线：{connectCount}</p>
      )}
      <div className="text-center">
        <p>{workspace.name}</p>
      </div>
      <ConnectedContent>
        {socket ? (
          <Badge
            variant="outline"
            className="bg-green-300 py-2 ml-auto  dark:bg-green-300/10 w-16 "
          >
            已连接
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-300 py-2   ml-auto  w-16 dark:bg-red-300/10">
            未连接
          </Badge>
        )}
      </ConnectedContent>
    </HeaderContainer>
  );
});

export default ChatMeta;
