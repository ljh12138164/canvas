import DeleteCard from '@/components/board/DeleteCard';
import FromCard from '@/components/board/FromCard';
import RefreshInviteCode from '@/components/board/RefreshInviteCode';

import { Card } from '@/components/ui/card';
import userStore from '@/store/user';
import { DEFAULT_ICON } from '@/utils/board';
import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
const WorkSpaceSettingCard = styled.div`
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
  if (workSpace == undefined) {
    toast.error('未找到工作区');
    return navigator('/dashboard/home');
  }

  return (
    <WorkSpaceSettingCard>
      <Card>
        <FromCard
          Back={true}
          editId={workSpace.id}
          type='edit'
          userData={userData}
          defaultFrom={{
            name: workSpace.name || '',
            file: workSpace.imageUrl || DEFAULT_ICON,
          }}
        />
      </Card>
      <RefreshInviteCode
        inviteCode={workSpace.inviteCode}
        workspaceId={workSpace.id}
        userId={userData.id}
      ></RefreshInviteCode>
      <DeleteCard workspaceId={workSpace.id} userId={userData.id} />
    </WorkSpaceSettingCard>
  );
});

export default WorkspaceSetting;
