import WorkspceSetting from '@/components/board/WorkspceSetting';

import userStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
export const WorkSpaceSettingCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
// @ts-ignore
const WorkspaceSetting = observer(() => {
  const { userData, workspace } = userStore;
  const navigator = useNavigate();
  const params = useParams();
  if (userData == null || workspace == null) return null;
  const workSpace = workspace?.find((item) => item.id === params.workspaceId);
  if (workSpace === undefined) {
    toast.error('未找到工作区');
    return navigator('/dashboard/home');
  }

  return (
    <WorkSpaceSettingCard>
      <WorkspceSetting userData={userData} workSpace={workSpace} />
    </WorkSpaceSettingCard>
  );
});

export default WorkspaceSetting;
