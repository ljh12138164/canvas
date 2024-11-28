import useStore from "@/store/user";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
// import { toast } from "sonner";

const Task = () => {
  const store = useStore;
  const params = useParams();

  // const {}=useMe
  if (store.userData === null || store.activeProject === null) return null;
  if (!store.userData) {
    toast.error("请先登录");
    return <Navigate to="/sign-in" replace />;
  }
  if (!store.activeProject) {
    toast.error("未选择项目");
    return <Navigate to="/dashboard" replace />;
  }
  if (!params.workspaceId) {
    toast.error("未选择工作区");
    return <Navigate to="/dashboard" replace />;
  }
  return <div></div>;
};

export default Task;
