"use client";
import { getIndexDB } from "@/app/_lib/utils";
import { BoardData } from "@/app/_types/board";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { LuList } from "react-icons/lu";
import BoardCreate from "../Board/BoardCreate";
import BoardItem from "../Board/BoardItem";
import { BoardTable } from "../Board/BoardTable";
import { columns } from "../Board/BoardTableColume";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
const TryMain = () => {
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);
  const [data, setData] = useState<BoardData[]>([]);
  const [list, setList] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getIndexDB();
      setData(data as BoardData[]);
      setChange(false);
      setLoading(false);
    })();
  }, [change]);

  if (loading) return <Skeleton className="h-screen w-full" />;
  return (
    <div>
      <BoardCreate
        setChange={setChange}
        token={undefined}
        data={data}
      ></BoardCreate>
      {!loading && !data.length && (
        <p className="text-xl text-muted-foreground flex items-center justify-center h-full flex-col gap-2">
          <span>还没有创建画布</span>
          <span>😢😢😢</span>
        </p>
      )}
      {!loading && data?.length && (
        <section className="text-[1rem] x px-2 font-bold mt-3 w-full flex justify-between items-center text-muted-foreground">
          <span className="flex items-center gap-2">
            <LuList className="size-4" />
            面板列表
          </span>
          <div className="w-36">
            <Select
              value={list ? "list" : "grid"}
              onValueChange={(value) => {
                setList(value === "list");
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={list ? "列表" : "网格"}
                  className="text-sm "
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem disabled={list || loading} value="list">
                  列表
                </SelectItem>
                <SelectItem disabled={!list || loading} value="grid">
                  网格
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      )}
      {list && data?.length ? (
        <div
          onClick={(e) => {
            if (loading) e.stopPropagation();
          }}
        >
          <ScrollArea className="h-[calc(100dvh-300px)] w-full">
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
                      token={undefined}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      ) : (
        <></>
      )}
      {/* @ts-ignore */}
      {!list && <BoardTable columns={columns} data={data || []} />}
    </div>
  );
};

export default TryMain;
