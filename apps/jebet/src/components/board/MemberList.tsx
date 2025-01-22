import { useGetJebtUserList } from '@/server/hooks/user';
import type { Workspace } from '@/types/workspace';
import type { UserResource } from '@clerk/types';
import styled from 'styled-components';
import { animate } from '../project/ProjectContent';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import MemberItem from './MemberItem';
const ListContain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const MemberListContainer = styled.div`
  animation: ${animate} 0.4s ease-in-out;
`;

const MemberList = ({
  workspace,
  user,
}: {
  workspace: Workspace;
  user: UserResource;
}) => {
  const { data, isLoading } = useGetJebtUserList({
    workspaceId: workspace.id,
    userId: user.id,
  });
  if (isLoading) return;
  const userRole = data?.user.role;
  const currentUserIsAdmin = userRole === 'admin';

  return (
    <MemberListContainer>
      <Card>
        <CardHeader>
          <CardTitle>工作区成员</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.data.map((item) => (
            <ListContain key={item.id}>
              <MemberItem
                currentUserId={user.id}
                canOperation={currentUserIsAdmin}
                user={item}
                isAdmin={item.role === 'admin'}
              />
              <Separator className="my-4" />
            </ListContain>
          ))}
        </CardContent>
      </Card>
    </MemberListContainer>
  );
};

export default MemberList;
