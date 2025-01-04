import { getCurrentUser } from "@/app/_database/user";
import { useUser } from "@/app/_store/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

/**
 * 检查用户信息
 * @returns
 */
const useUsers = ({
  redirects = true,
  type = "goError",
}: {
  redirects?: boolean;
  type?: "goLoading" | "goError";
}) => {
  const { user, loading, setUser, setLoading } = useUser();
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        if (redirects && type === "goError") {
          toast.error("请先登录");
          redirect("/sign-in");
        }
      } else {
        setUser(user);
        if (redirects && type === "goLoading") {
          toast.success("用户已登录");
          redirect("/board");
        }
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { user, loading };
};

export default useUsers;
