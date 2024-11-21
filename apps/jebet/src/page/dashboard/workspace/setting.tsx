import FromCard from "@/components/board/FromCard";
import { Card } from "@/components/ui/card";
import userStore from "@/store/user";
import { DEFAULT_ICON } from "@/utils/board";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
const WorkspaceSetting = observer(() => {
  const { userData, workspace } = userStore;
  let { activeWorkSpace } = userStore;
  const navigator = useNavigate();
  const params = useParams();
  const workSpace = workspace?.find((item) => item.id === params.workspaceId);
  if (workSpace) {
    activeWorkSpace = workSpace;
  }
  if (!userData) return null;
  if (!activeWorkSpace) navigator("/dashboard");

  return (
    <Card>
      <FromCard
        editId={activeWorkSpace?.id}
        type="edit"
        userData={userData}
        defaultFrom={{
          name: activeWorkSpace?.name || "",
          file: activeWorkSpace?.imageUrl || DEFAULT_ICON,
        }}
      />
    </Card>
  );
});

export default WorkspaceSetting;
