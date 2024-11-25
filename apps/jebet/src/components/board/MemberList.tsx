import { useGetJebtUserList } from '@/server/hooks/user';
import { Workspace } from '@/types/workspace';
import { UserResource } from '@clerk/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import MemberItem from './MemberItem';
import styled from 'styled-components';
import { Separator } from '../ui/separator';
const ListContain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
            <Separator className='my-4' />
          </ListContain>
        ))}
      </CardContent>
    </Card>
  );
};

export default MemberList;
