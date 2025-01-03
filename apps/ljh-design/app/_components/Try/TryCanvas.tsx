"use client";
import { redirect } from "next/navigation";
import TryEdit from "../EditComponents/TryEdit";
import { useTryStore } from "@/app/_hook/useTryData";
import toast from "react-hot-toast";
const TryCanvas = ({ id }: { id: string }) => {
  const { data, isLoading } = useTryStore({ id });
  if (isLoading) return <></>;
  if (!data) {
    toast.dismiss();
    toast.error("未找到面板数据");
    redirect("/try/board");
  }
  return <TryEdit data={data} id={id} />;
};

export default TryCanvas;
