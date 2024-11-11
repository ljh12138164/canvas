"use client";
import { AuthStore, authStore } from "@/store/auth";
import { createContext, useContext } from "react";

const LoadingContext = createContext<AuthStore>(authStore.getState());
export default function LoginProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = authStore();
  return (
    <LoadingContext.Provider value={auth}>{children}</LoadingContext.Provider>
  );
}
export const useUserId = () => {
  const { userId, isLoading, setUserId } = useContext(LoadingContext);
  return { userId, isLoading, setUserId };
};
