import { cn } from "@/lib/utils";
import { useCreateTask } from "@/server/hooks/tasks";
import { Member, TaskStatus } from "@/types/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CardContent } from "../ui/card";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { DrawerFooter } from "../ui/drawerui";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { SelectImage, SelectItems } from "../board/SiderBar";

const zShema = z.object({
  name: z
    .string({
      required_error: "请输入任务名称",
    })
    .min(2)
    .max(20),
  lastTime: z.date({
    required_error: "请选择最后时间",
  }),
  assigneeId: z.string({
    required_error: "请选择指派人",
  }),
  description: z
    .string({
      required_error: "请输入任务描述",
    })
    .optional(),
  status: z.nativeEnum(TaskStatus),
});
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;
const FromItem = styled.div`
  margin-bottom: 1rem;
`;
const TaskFrom = ({
  workspaceId,
  projectId,
  type,
  userData,
  currentUserId,
  isMobile,
}: {
  workspaceId: string;
  projectId: string;
  type: "create" | "edit";
  userData: Member[] | undefined;
  currentUserId: string;
  isMobile: boolean;
}) => {
  const { register, handleSubmit, getValues, setValue } = useForm<
    z.infer<typeof zShema>
  >({
    resolver: zodResolver(zShema),
  });
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeRef2 = useRef<HTMLButtonElement>(null);
  const { createTask, createTaskLoading } = useCreateTask();
  const onSubmit = (data: z.infer<typeof zShema>) => {
    if (type === "create") {
      createTask({
        json: {
          ...data,
          workspaceId,
          projectId,
          currentUserId,
        },
      });
    }
    if (type === "edit") {
      // updateTask(data);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="my-8 flex flex-col gap-4 mx-0">
        <FromItem>
          <Label htmlFor="name">任务名称</Label>
          <Input id="name" {...register("name")} placeholder="请输入任务名称" />
        </FromItem>
        <FromItem>
          <Label htmlFor="lastTime">最后时间</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full">
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                className="w-full"
                selected={getValues("lastTime")}
                onSelect={(date) => {
                  if (date) {
                    setValue("lastTime", date);
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FromItem>
        <FromItem>
          <Label htmlFor="assigneeId">指派人</Label>
          <Select {...register("assigneeId")}>
            <SelectTrigger>
              <SelectValue placeholder="请选择指派人" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              <SelectGroup>
                {userData?.map((item) => (
                  <SelectItems key={item.id} value={item.id}>
                    <div className="flex items-center justify-start gap-2 ">
                      <SelectImage src={item.userImage} alt={item.username} />
                      <p>{item.username}</p>
                    </div>
                  </SelectItems>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FromItem>
        <FromItem>
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" {...register("description")} />
        </FromItem>
        {!isMobile ? (
          <DrawerFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={closeRef2}>
                取消
              </Button>
            </DialogClose>
            <Button>{type === "create" ? "添加" : "保存"}</Button>
          </DrawerFooter>
        ) : (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={closeRef}>
                取消
              </Button>
            </DialogClose>
            <Button>{type === "create" ? "添加" : "保存"}</Button>
          </DialogFooter>
        )}
      </CardContent>
    </form>
  );
};

export default TaskFrom;
