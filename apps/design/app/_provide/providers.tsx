"use client";
import QueryProvedie from "./query-provide";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvedie>
      {/* <AuthProvedie> */}
      {children}
      {/* </AuthProvedie> */}
    </QueryProvedie>
  );
};
