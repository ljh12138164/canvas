import { animate } from '@/components/project/ProjectContent';
import userStore from '@/store/user';
import { Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EchartContent from './EchartContent';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const MainWorkSpace = styled.main`
  display: flex;
  flex-direction: column;
  animation: ${animate} 0.4s ease-in-out;
`;
const NavWorkSpace = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
  background: white;
  padding: 0 8px;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #f8f9fa;
  cursor: pointer;
  color: #495057;
  font-size: 14px;

  &:hover {
    background: #e9ecef;
  }
`;
const WorkSpace = observer(() => {
  const params = useParams();
  const navigator = useNavigate();
  const { workspace, userData } = userStore;

  let { activeWorkSpace } = userStore;

  if (userData == null || workspace == null) return null;
  if (activeWorkSpace) {
    return <div>{JSON.stringify(activeWorkSpace)}</div>;
  }
  //设置新工作区
  const newActiveWorkspace = workspace?.find(
    (item) => item.id === params.workspaceId
  );
  if (newActiveWorkspace) {
    activeWorkSpace = newActiveWorkspace;
  }

  if (activeWorkSpace) {
    return (
      <MainWorkSpace>
        <NavWorkSpace>
          <h2 className='text-lg font-bold'>工作区：{activeWorkSpace.name}</h2>
          <div className='ml-auto'>
            <ActionButton
              onClick={() =>
                navigator(`/dashboard/${params.workspaceId}/setting`)
              }
            >
              <Settings size={16} />
              工作区设置
            </ActionButton>
          </div>
        </NavWorkSpace>
        <Separator className='h-1' />
        <EchartContent id={userData.id} workspaceId={activeWorkSpace.id} />
      </MainWorkSpace>
    );
  } else {
    toast.error('工作区不存在');
    navigator('/dashboard/home');
  }
});

export default WorkSpace;
