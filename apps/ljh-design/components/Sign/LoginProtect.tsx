"use client";
import { jwtDecode } from "@/lib/sign";
import { redirect } from "next/navigation";
import { useEffect, useContext, createContext, useState } from "react";
const initData = {
  isLoading: true,
  userId: "",
};
const LoadingContext = createContext(initData);
export default function LoginProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) redirect("/board/sign-in");
    (async () => {
      const user = await jwtDecode(token);
      if (!user) redirect("/board/sign-in");
      setIsLoading(false);
      setUserId(user.userid);
    })();
  }, [isLoading, userId]);
  return (
    <LoadingContext.Provider value={{ isLoading, userId }}>
      {children}
    </LoadingContext.Provider>
  );
}
export const useUserId = () => {
  const { userId, isLoading } = useContext(LoadingContext);
  return { userId, isLoading };
};
