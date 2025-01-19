"use client";
import Form from "./Form";
import useUsers from "@/app/_hook/useUser";
import { redirect } from "next/navigation";

const CreateShow = () => {
  const { user, loading } = useUsers({ redirects: true });
  if (loading) return;
  if (!user) redirect("/sign-in");
  return <Form userId={user.user.id} />;
};

export default CreateShow;
