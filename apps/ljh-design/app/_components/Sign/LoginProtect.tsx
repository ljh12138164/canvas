"use client";
import { useUser } from "@/app/_store/auth";
import { redirect } from "next/navigation";

export default function LoginProtect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  if (loading) return;
  if (!user) redirect("/sign-in");
  return children;
}
