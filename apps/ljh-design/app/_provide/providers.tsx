"use client";
import type { ReactNode } from "react";
import QueryProvedie from "@/app/_provide/query-provide";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <QueryProvedie>{children}</QueryProvedie>;
};
