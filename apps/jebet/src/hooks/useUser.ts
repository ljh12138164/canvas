import { getLocalToken, jwtDecode } from "@/lib/sign";
import { authStore } from "@/store/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 检查用户信息
 * @returns
 */
const useUser = () => {
  const { userId, isLoading, setUserId, setIsLoading } = authStore;
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const token = await getLocalToken();
      if (!token) return;
      const user = await jwtDecode(token);
      if (user?.userid) {
        navigate("/board");
      }
    })();
  }, [navigate, setIsLoading, setUserId]);
  return { userId, isLoading };
};

export default useUser;
