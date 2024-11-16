"use client";
import { useEffect, useState } from "react";
import BoardCreate from "../Board/BoardCreate";
import BoardItem from "../Board/BoardItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getIndexDB } from "@/lib/utils";
import { Board } from "@/types/board";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { jwtDecode } from "@/lib/sign";
const TryMain = () => {
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);
  const [data, setData] = useState<Board[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let user;
    (async () => {
      user = await jwtDecode(token);
      if (user) {
        toast.loading("已登录，跳转中...");
        redirect("/board");
      }
      const data = await getIndexDB();
      setData(data as Board[]);
      setLoading(false);
    })();
  }, [loading]);
  useEffect(() => {
    (async () => {
      const data = await getIndexDB();
      setData(data as Board[]);
      setChange(false);
    })();
  }, [change]);
  if (loading) return;
  return (
    <div>
      <BoardCreate
        setChange={setChange}
        userId={undefined}
        data={data}
      ></BoardCreate>
      {!loading && !data.length && (
        <p className="text-xl text-muted-foreground flex items-center justify-center h-full flex-col gap-2">
          <span>还没有创建画布</span>
          <span>😢😢😢</span>
        </p>
      )}
      {data?.length ? (
        <div
          onClick={(e) => {
            if (loading) e.stopPropagation();
          }}
        >
          <Table className={loading ? "opacity-50" : ""}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">名称</TableHead>
                <TableHead className="w-[100px]">尺寸</TableHead>
                <TableHead className="w-[100px]">创建时间</TableHead>
                <TableHead className="w-[50px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => (
                <TableRow
                  onClick={() => {
                    redirect(`/try/Edit/${item.id}`);
                  }}
                  key={item.id}
                  className="h-20 cursor-pointer"
                >
                  <BoardItem
                    setChange={setChange}
                    board={item}
                    userId={undefined}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TryMain;
