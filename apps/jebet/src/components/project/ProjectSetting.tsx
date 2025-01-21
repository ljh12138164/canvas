import DeleteCard from '@/components/board/DeleteCard';
import FromCard from '@/components/board/FromCard';
import { Card } from '@/components/ui/card';
import { WorkSpaceSettingCard } from '@/page/dashboard/workspace/setting';
import { useGetJebtUserList } from '@/server/hooks/user';
import type { Project, Workspace } from '@/types/workspace';
import { DEFAULT_ICON } from '@/utils/board';
import type { UserResource } from '@clerk/types';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { animate } from './ProjectContent';

const ProjectSettingContainer = styled.div`
  animation: ${animate} 0.4s ease-in-out;
`;

const ProjectSetting = observer(
  ({
    workSpace,
    project,
    userData,
  }: {
    workSpace: Workspace;
    userData: UserResource;
    project: Project;
  }) => {
    const { data, isLoading } = useGetJebtUserList({
      workspaceId: workSpace.id,
      userId: userData.id,
    });

    return (
      <ProjectSettingContainer>
        <WorkSpaceSettingCard>
          {!isLoading && (
            <>
              <Card>
                <FromCard
                  formType="project"
                  canEdit={data?.user.role === 'admin'}
                  Back={true}
                  editId={project.id}
                  type="edit"
                  userData={userData}
                  defaultFrom={{
                    name: project.name || '',
                    file: project.imageUrl || DEFAULT_ICON,
                  }}
                />
              </Card>
              <DeleteCard type="project" imageUrl={project.imageUrl} workspaceId={workSpace.id} projectId={project.id} canEdit={data?.user.role === 'admin'} userId={userData.id} />
            </>
          )}
        </WorkSpaceSettingCard>
      </ProjectSettingContainer>
    );
  },
);
export default ProjectSetting;
