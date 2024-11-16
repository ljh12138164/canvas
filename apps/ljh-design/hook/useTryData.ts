"use client";
import { getTryBoardById } from "@/lib/utils";
import { tryStore } from "@/store/trystore";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
export const useTryStore = ({ id }: { id: string }) => {
  const { isLoading, data, setData, setIsLoading } = tryStore();
  useEffect(() => {
    (async () => {
      try {
        const data = await getTryBoardById(id);
        if (data) setData(data);
        else {
          toast.error("数据不存在");
          redirect("/try/board");
        }
        setIsLoading(false);
      } catch {
        toast.error("读取失败");
      }
    })();
  }, [data, isLoading, setData, setIsLoading, id]);
  return { isLoading, data, setData, setIsLoading };
};
