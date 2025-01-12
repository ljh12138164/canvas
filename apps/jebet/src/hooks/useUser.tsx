import { useNavigate, useParams } from "react-router-dom";
import userStore from "@/store/user";
import { useEffect, useState } from "react";
import { Workspace } from "@/types/workspace";
import { UserResource } from "@clerk/types";

const useUserAndWorkspace = () => {
  const [isLoading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null
  );
  const [user, setUser] = useState<UserResource | null>(null);
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { workspace, userData } = userStore;
  useEffect(() => {
    // 初始化中
    if (!workspace || userData === null) return;
    // 未登录
    if (!userData) navigate("/sign-in");
    // 工作区不存在
    const activeWorkspace = workspace?.find((item) => item.id === workspaceId);
    if (!activeWorkspace) navigate("/dashboard/home");
    // 初始化完成
    setActiveWorkspace(activeWorkspace!);
    setUser(userData);
    setLoading(false);
  }, [navigate, workspaceId, workspace, userData]);

  return { activeWorkspace, isLoading, user };
};

export default useUserAndWorkspace;
