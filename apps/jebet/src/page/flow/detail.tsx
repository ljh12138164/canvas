import { FlowDetail } from "@/components/flow/FlowDetail";
import { animate } from "@/components/project/ProjectContent";
import { ScrollArea } from "@/components/ui/scrollArea";
import { useIsMobile } from "@/hooks/use-mobile";
import useStore from "@/store/user";
import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";

const FlowContainer = styled.main<{ mobile: boolean }>`
  width: 100%;
  height: 100%;
  max-width: ${(props) =>
    props.mobile ? "calc(100dvw - 50px)" : "calc(100dvw - 300px)"};
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${animate} 0.4s ease-in-out;
`;
const Flow = observer(() => {
  const isModel = useIsMobile();
  const store = useStore;
  const params = useParams();
  if (store.userData === null || store.workspace === null) return <></>;
  const activeWorkSpace = store.workspace.find(
    (item) => item.id === params.workspaceId
  );
  if (!store.userData) {
    toast({
      title: "请先登录",
      description: "请稍后再试",
      variant: "destructive",
    });
    return <Navigate to="/sign-in" replace />;
  }
  if (!activeWorkSpace) {
    toast({
      title: "未找到工作区",
      description: "请稍后再试",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }
  if (!params.workspaceId) {
    toast({
      title: "未选择工作区",
      description: "请稍后再试",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <FlowContainer mobile={isModel}>
      <ScrollArea className="w-full h-full">
        <FlowDetail
          workspaceId={params.workspaceId}
          workspace={activeWorkSpace}
          userData={store.userData}
        />
      </ScrollArea>
    </FlowContainer>
  );
});

export default Flow;
