"use client";
import { UserContext } from "@/hook/UserContext";
import QueryProvedie from "./query-provide";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvedie>
      <UserContext>{children}</UserContext>
    </QueryProvedie>
  );
};
