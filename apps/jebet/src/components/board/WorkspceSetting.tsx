import { animate } from '@/components/project/ProjectContent';
import { useGetJebtUserList } from '@/server/hooks/user';
import type { Workspace } from '@/types/workspace';
import { DEFAULT_ICON } from '@/utils/board';
import type { UserResource } from '@clerk/types';
import styled from 'styled-components';
import { Card } from '../ui/card';
import DeleteCard from './DeleteCard';
import FromCard from './FromCard';
import RefreshInviteCode from './RefreshInviteCode';
const CardContent = styled.div`
  animation: ${animate} 0.4s ease-in-out;
`;
const WorkspceSetting = ({
  userData,
  workSpace,
}: {
  userData: UserResource;
  workSpace: Workspace;
}) => {
  const { data, isLoading } = useGetJebtUserList({
    workspaceId: workSpace.id,
    userId: userData.id,
  });
  if (isLoading) return null;
  return (
    <CardContent>
      <Card>
        <FromCard
          formType="workspace"
          canEdit={data?.user.role === 'admin'}
          Back={true}
          editId={workSpace.id}
          type="edit"
          userData={userData}
          defaultFrom={{
            name: workSpace.name || '',
            file: workSpace.imageUrl || DEFAULT_ICON,
          }}
        />
      </Card>
      <RefreshInviteCode canEdit={data?.user.role === 'admin'} inviteCode={workSpace.inviteCode} workspaceId={workSpace.id} userId={userData.id} />
      <DeleteCard type="workspace" imageUrl={workSpace.imageUrl} canEdit={data?.user.role === 'admin'} workspaceId={workSpace.id} userId={userData.id} />
    </CardContent>
  );
};

export default WorkspceSetting;
