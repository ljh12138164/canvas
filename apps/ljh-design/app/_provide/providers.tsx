"use client";
import QueryProvedie from "@/app/_provide/query-provide";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvedie>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryProvedie>
  );
};
