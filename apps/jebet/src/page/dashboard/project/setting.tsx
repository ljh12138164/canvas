import ProjectSetting from '@/components/project/ProjectSetting';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '@/store/user';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export default function ProjectSettingPage() {
  const { projectId, workspaceId } = useParams();
  const navigate = useNavigate();
  if (!projectId || !workspaceId) {
    navigate('/dashboard/project');
  }
  const store = useStore;
  if (
    store.userData === null ||
    store.activeProject === null ||
    store.workspace === null
  )
    return null;
  if (!store.userData) {
    toast.error('请先登录');
    return <Navigate to='/sign-in' replace />;
  }
  if (!store.activeProject) {
    toast.error('未找到项目');
    return <Navigate to='/dashboard' replace />;
  }
  const workSpace = store.workspace.find((item) => item.id === workspaceId);
  if (!workSpace) {
    toast.error('未找到工作区');
    return <Navigate to='/dashboard' replace />;
  }
  return (
    <ProjectSetting
      workSpace={workSpace}
      project={store.activeProject}
      userData={store.userData}
    />
  );
}
