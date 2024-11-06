"use client";
import { useBoardUserQuery } from "@/hook/query/useBoardQuery";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import BoardCreate from "./BoardCreate";

const BoardMain = ({ userId }: { userId: string }) => {
  const { data, error, isLoading } = useBoardUserQuery({ userid: userId });
  const query = useQueryClient();
  return (
    <ScrollArea className="w-full h-full overflow-auto ">
      {isLoading && (
        // TODO: 龙骨架加载
        <div className="w-full h-full flex justify-center items-center text-5xl">
          <Loader className="animate-spin" />
        </div>
      )}
      {!isLoading && !error && <BoardCreate userId={userId} />}
      <div className=" flex flex-col  gap-2 h-[calc(100dvh-300px)] items-center  text-5xl">
        {error && (
          <Button
            variant="outline"
            className="ml-4 w-fit text-black px-6 py-4 "
            onClick={() => query.invalidateQueries({ queryKey: [userId] })}
          >
            重试
          </Button>
        )}
        {!isLoading && !data?.length && (
          <p className="text-xl text-muted-foreground flex items-center justify-center h-full flex-col gap-2">
            <span>还没有创建画布</span>
            <span>😢😢😢</span>
          </p>
        )}
      </div>
    </ScrollArea>
  );
};

export default BoardMain;
