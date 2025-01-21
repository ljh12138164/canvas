import Detail from '@/components/detail';
import useStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';

const Task = observer(() => {
  const store = useStore;
  const params = useParams();

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
  if (!params.projectId) {
    toast.error('未选择项目');
    return <Navigate to="/dashboard" replace />;
  }
  return <Detail workspaceId={params.workspaceId} projectId={params.projectId} userData={store.userData} />;
});

export default Task;
