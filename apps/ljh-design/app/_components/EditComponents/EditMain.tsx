"use client";
import useUser from "@/app/_hook/useUser";
import { redirect } from "next/navigation";
import Edit from "./Edit";

const EditMain = ({ id }: { id: string }) => {
  const { user, loading } = useUser({ redirects: true });
  if (loading) return;
  if (!user) redirect("/sign-in");
  return <Edit token={user.session.access_token} id={id} />;
};

export default EditMain;
