import ProjectContent from "@/components/project/ProjectContent";
import ProjectNav from "@/components/project/ProjectNav";
import useStore from "@/store/user";
import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
const ProjectContainer = styled.main`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
//
const Project = observer(() => {
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
  return (
    <ProjectContainer>
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
