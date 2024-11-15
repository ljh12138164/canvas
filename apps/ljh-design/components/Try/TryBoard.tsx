"use client";
import { jwtDecode } from "@/lib/sign";
import { Board } from "@/types/board";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BoardCreate from "../Board/BoardCreate";
import Logo from "../Comand/Logo";
import { getIndexDB } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import BoardItem from "../Board/BoardItem";

const TryBoard = () => {
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
      console.log(data);
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
  return (
    <div>
      {!loading && (
        <div className="h-full w-full">
          <aside className="hidden bg-muted transition-all duration-300 lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full">
            <div className="m-2 flex items-center gap-x-4">
              <Logo />
              <span className="text-xl font-semibold text-primary">
                {/* TODO: logo */}
                ljh-design
              </span>
            </div>
          </aside>
          <div className="lg:pl-[300px] flex flex-col h-full">
            <div className="h-[60px] bg-slate-50"></div>
            <main
              className="px-2 py-4 bg-white flex-1 min-w-[380px] overflow-hidden"
              style={{
                scrollbarWidth: "none",
              }}
            >
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
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryBoard;
