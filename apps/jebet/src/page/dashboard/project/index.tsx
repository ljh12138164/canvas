import ProjectContent from '@/components/project/ProjectContent';
import ProjectNav from '@/components/project/ProjectNav';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import useStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const ProjectContainer = styled.main<{ mobile: boolean }>`
  height: 100%;
  max-width: ${(props) => (props.mobile ? 'calc(100dvw - 50px)' : 'calc(100dvw - 300px)')};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
`;

const ProjectSkeleton = () => {
  return (
    <SkeletonContainer>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-[200px]" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[40%]" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
};

const Project = observer(() => {
  const store = useStore;
  const params = useParams();
  const isModel = useIsMobile();

  if (!store.userData || !store.activeProject || !params.workspaceId) {
    if (store.userData === null || store.activeProject === null) {
      return (
        <ProjectContainer mobile={isModel}>
          <ProjectSkeleton />
        </ProjectContainer>
      );
    }
    if (!store.userData) {
      toast.error('请先登录');
      return <Navigate to="/sign-in" replace />;
    }
    if (!store.activeProject) {
      toast.error('未选择项目');
      return <Navigate to="/dashboard" replace />;
    }
    toast.error('未选择工作区');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ProjectContainer mobile={isModel}>
      <ProjectNav project={store.activeProject} />
      <ProjectContent
        userData={store.userData}
        workspaceId={params.workspaceId}
        projectId={store.activeProject.id}
      />
    </ProjectContainer>
  );
});
export default Project;
