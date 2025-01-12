"use client";
import { useEffect, useState } from "react";
import { Ai, Message } from "@/app/_types/ai";
import { getIndexDB, indexDBChange } from "@/app/_lib/ai";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useAi } from "@/app/_hook/query/useAi";
import { Separator } from "../../ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../ui/dialog";
const zod = z.object({
  input: z.string().min(1, { message: "请输入消息" }),
});

export const AiChatSider = () => {
  const [ai, setAi] = useState<Ai[]>([]);
  const { register, handleSubmit, reset } = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
  });
  const { getAiStream, getAiStreamPending } = useAi();
  useEffect(() => {
    getIndexDB().then((res) => setAi(res));
  }, []);

  const handleSend = async (data: z.infer<typeof zod>) => {
    if (!data.input.trim()) {
      toast.error("请输入消息");
      return;
    }

    const newMessage: Message = { role: "user", content: data.input };
    const aiResponse: Message = {
      role: "assistant",
      content: `模拟AI回复：${data.input}`,
    };

    // 创建新的对话记录
    const newChat: Ai = {
      id: Date.now().toString(),
      messages: [newMessage, aiResponse],
    };

    // 保存到 IndexDB
    await indexDBChange({ type: "add", data: newChat });

    // 更新状态
    setAi((prev) => [...prev, newChat]);
  };

  return (
    <div className="flex flex-col h-full">
      <section className="flex items-center justify-between gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <span>选择会话</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[99999]">
            <DialogHeader>
              <DialogTitle>选择会话</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <span>新的会话</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[99999]">
            <DialogHeader>
              <DialogTitle>新的会话</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <Input placeholder="请输入会话名称" />
            </div>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <ScrollArea className="h-[calc(100vh-230px)] p-4">
        {ai.map((chat) => (
          <div key={chat.id} className="mb-6">
            {chat.messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-100 ml-auto"
                    : "bg-gray-100"
                } max-w-[80%]`}
              >
                {message.content}
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
      <Separator className="mt-4 " />
      <form className="flex gap-2 pt-2" onSubmit={handleSubmit(handleSend)}>
        <Input placeholder="输入消息..." {...register("input")} />
        <Button type="submit">发送</Button>
      </form>
    </div>
  );
};
