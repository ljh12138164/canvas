"use client";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { useAi } from "@/app/_hook/query/useAi";
import { createAi, getIndexDB } from "@/app/_lib/ai";
import { Message, MessageArr } from "@/app/_types/ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { Skeleton } from "../../ui/skeleton";
// 聊天的表单
const zod = z.object({
  input: z.string().min(1, { message: "请输入消息" }),
});
// 创建新会话
const newsZod = z.object({
  title: z.string(),
});

export const AiChatSider = () => {
  const [loading, setLoading] = useState(true);
  // 全部会话列表
  const [ai, setAi] = useState<MessageArr[]>([]);
  // 当前会话id
  const [currentId, setCurrentId] = useState<string>(
    localStorage.getItem("current_ai_id") || ""
  );
  // 聊天的表单
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
  });
  // 新建会话的表单
  const {
    register: newsRegister,
    handleSubmit: newsHandleSubmit,
    formState: newsFormState,
  } = useForm<z.infer<typeof newsZod>>({
    resolver: zodResolver(newsZod),
  });

  const { getAiStream, getAiStreamPending } = useAi();
  // 获取全部会话
  useEffect(() => {
    getIndexDB().then((res) => {
      // 初始化全部上下文
      setAi(res);
      if (!res.length) {
        // 创建新对话
        const newId = nanoid();
        setCurrentId(newId);
        localStorage.setItem("current_ai_id", newId);
        const newMessage: Message = {
          role: "user",
          message: [{ text: "你好！我是你的智能助理，有什么可以帮助您的吗？" }],
        };
        getAiStream(
          {
            json: {
              prompt: "你好！我是你的智能助理，有什么可以帮助您的吗？",
            },
          },
          {
            onSuccess: (data) => {
              const reader = data.getReader();
              let chunks = "";
              reader
                .read()
                .then(function processText({ done, value }) {
                  if (done) {
                    console.log("Stream complete");
                    return;
                  }
                  const uint8Array = new Uint8Array(value);
                  chunks += new TextDecoder("utf-8").decode(uint8Array);
                  reader.read().then(processText);
                })
                .then(() => {
                  // 创建新对话
                  createAi(newId, newMessage);
                  console.log("成功");
                });
            },
            onSettled: () => {
              setLoading(false);
            },
          }
        );
      }
    });
  }, []);

  const handleSend = async (data: z.infer<typeof zod>) => {
    if (!data.input.trim()) {
      toast.error("请输入消息");
      return;
    }
    // 更新状态
  };

  const handleCreate = async (data: z.infer<typeof newsZod>) => {
    console.log(data);
  };
  if (loading)
    return (
      <div className="flex flex-col h-full">
        <section className="flex items-center justify-between gap-2">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </section>
        <Skeleton className="h-[calc(100vh-230px)]" />
        <Separator className="mt-6" />
        <Skeleton className="h-10" />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <section className="flex items-center justify-between gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <span>选择会话</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[99999]" asChild>
            <section>
              <DialogHeader>
                <DialogTitle>选择会话</DialogTitle>
                <DialogDescription>选择一个会话，继续聊天</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center">
                <ScrollArea className="max-h-[45dvh] p-4" asChild>
                  <section>
                    {ai.map((chat) => (
                      <div key={chat.id} className="mb-6 border-b pb-6">
                        <Button variant="outline" className="w-full">
                          {chat.id}
                        </Button>
                      </div>
                    ))}
                  </section>
                </ScrollArea>
              </div>
            </section>
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
              <DialogDescription>创建一个新的会话，开始聊天</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <Input placeholder="请输入会话名称" {...newsRegister("title")} />
              {newsFormState?.errors?.title && (
                <p className="text-red-500">
                  {newsFormState?.errors?.title?.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <form onSubmit={newsHandleSubmit(handleCreate)}>
                <Button type="submit">创建</Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <ScrollArea className="h-[calc(100vh-230px)] p-4" asChild>
        <section>
          11
          {/* {ai.map((chat) => (
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
                ))} */}
        </section>
      </ScrollArea>
      <Separator className="mt-4 " />
      <form className="flex gap-2 pt-2" onSubmit={handleSubmit(handleSend)}>
        <Input placeholder="输入消息..." {...register("input")} />
        <Button type="submit">发送</Button>
      </form>
    </div>
  );
};
