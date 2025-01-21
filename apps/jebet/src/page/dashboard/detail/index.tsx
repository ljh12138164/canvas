import { useIsMobile } from '@/hooks/use-mobile';
import useStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Task from '../project/task';
const ProjectContainer = styled.main<{ mobile: boolean }>`
  height: 100%;
  max-width: ${(props) => (props.mobile ? 'calc(100dvw - 50px)' : 'calc(100dvw - 300px)')};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
//
const Project = observer(() => {
  const store = useStore;
  const params = useParams();

  const isModel = useIsMobile();
  // const {}=useMe
  if (store.userData === null || store.activeProject === null) return null;
  if (!store.userData) {
    toast.error('请先登录');
    return <Navigate to="/sign-in" replace />;
  }
  if (!store.activeProject) {
    toast.error('未选择项目');
    return <Navigate to="/dashboard" replace />;
  }
  if (!params.workspaceId) {
    toast.error('未选择工作区');
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <ProjectContainer mobile={isModel}>
      <Task />
    </ProjectContainer>
  );
});
export default Project;
