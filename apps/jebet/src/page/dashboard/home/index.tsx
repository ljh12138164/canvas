import DrawerFromCard from '@/components/board/DrawerFromCard';
import JoinCard from '@/components/board/JoinCard';
import { animate } from '@/components/project/ProjectContent';
import { Button } from '@/components/ui/button';
import useStore from '@/store/user';
import { FolderPlus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const HomeContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  animation: ${animate} 0.4s ease-in-out;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
const Home = observer(() => {
  const { userData } = useStore;
  if (userData == null) return null;

  // 未选择工作区时显示空状态
  return (
    <HomeContainer>
      <div className="text-muted-foreground text-center">
        <FolderPlus className="w-10 h-10 mx-auto mb-4" />
        <p className="text-lg font-medium">您还未选择工作区</p>
        <p className="text-sm">创建一个新的工作区开始使用</p>
      </div>
      <ButtonContainer>
        <DrawerFromCard type="workspace">
          <Button variant="outline">创建工作区</Button>
        </DrawerFromCard>
        <JoinCard />
      </ButtonContainer>
    </HomeContainer>
  );
});

export default Home;
