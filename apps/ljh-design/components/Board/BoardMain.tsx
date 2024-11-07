"use client";
import { useBoardUserQuery } from "@/hook/query/useBoardQuery";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import BoardCreate from "./BoardCreate";
import BoardItem from "./BoardItem";

const BoardMain = ({ userId }: { userId: string }) => {
  const { data, error, isLoading } = useBoardUserQuery({ userid: userId });
  const query = useQueryClient();
  return (
    <ScrollArea className="w-full h-full overflow-auto ">
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center text-5xl">
          <Loader className="animate-spin" />
        </div>
      )}
      {!isLoading && !error && <BoardCreate userId={userId} />}
      {error && <div className="h-[200px]"></div>}
      <div className=" flex flex-col  gap-2 h-[calc(100dvh-300px)]   text-5xl">
        {error && (
          <Button
            variant="outline"
            className=" w-fit text-black px-6 py-4 m-auto"
            onClick={() => query.invalidateQueries({ queryKey: [userId] })}
          >
            重试
          </Button>
        )}
        {!isLoading && !data?.length && !error && (
          <p className="text-xl text-muted-foreground flex items-center justify-center h-full flex-col gap-2">
            <span>还没有创建画布</span>
            <span>😢😢😢</span>
          </p>
        )}
        {!isLoading && !error && data?.length && (
          <p className="text-[1rem] x px-2 font-bold mt-3 text-muted-foreground">
            面板列表
          </p>
        )}
        {data && (
          <section className="flex flex-col gap-2 md:text-[1rem] text-[0.8rem]">
            {data?.map((item) => <BoardItem key={item.id} board={item} />)}
          </section>
        )}
      </div>
    </ScrollArea>
  );
};

export default BoardMain;
