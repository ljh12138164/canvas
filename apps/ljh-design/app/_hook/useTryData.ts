"use client";
import { getTryBoardById } from "@/app/_lib/utils";
import { tryStore } from "@/app/_store/trystore";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
/**
 * ### 获取试板数据
 * @param id
 * @returns
 */
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
