import userStore from "@/store/user";
import { Settings } from "lucide-react";
import { observer } from "mobx-react-lite";
import { toast } from "react-hot-toast";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
const Icon = styled(Settings)`
  cursor: pointer;
`;
const MainWorkSpace = styled.main`
  display: flex;
  flex-direction: column;
`;
const NavWorkSpace = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const WorkSpace = observer(() => {
  const params = useParams();
  const navigator = useNavigate();
  const { workspace } = userStore;
  let { activeWorkSpace } = userStore;
  if (workspace === null) return;
  if (activeWorkSpace) {
    return <div>{JSON.stringify(activeWorkSpace)}</div>;
  }
  //设置新工作区
  const newActiveWorkspace = workspace?.find(
    (item) => item.id === params.workspaceId
  );
  if (newActiveWorkspace) {
    activeWorkSpace = newActiveWorkspace;
  }

  if (activeWorkSpace) {
    return (
      <MainWorkSpace>
        <NavWorkSpace>
          <Icon onClick={() => navigator("setting")} />
        </NavWorkSpace>
        <Outlet></Outlet>
      </MainWorkSpace>
    );
  }
  //未找到工作区
  toast.error("未找到工作区");
  navigator("/dashboard/home");
});

export default WorkSpace;
