"use client";
import { Badge } from "@/app/_components/ui/badge";
import { useBoardListQuery } from "@/app/_hook/query/useBoardQuery";
import { useGetTap } from "@/app/_hook/query/useTap";
import { Board } from "@/app/_types/board";
import { Show } from "@/app/_types/show";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useMedia } from "react-use";
import { z } from "zod";
import Edit from "../Comand/RiceEdit/Edit";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
interface FormProps {
  defaultValue?: Show;
  token: string;
  userId: string;
}
const Form = ({ defaultValue, token, userId }: FormProps) => {
  // 获取模板
  const { data, isLoading } = useBoardListQuery({ token });
  // 获取标签
  const { tapData, tapLoading } = useGetTap(token, userId);
  const [open, setOpen] = useState(false);
  const isModal = useMedia("(max-width: 768px)");
  const [preview, setPreview] = useState<Board | null>(null);
  const zod = z.object({
    title: z.string({ message: "标题不能为空" }).min(1, "标题不能为空"),
    explanation: z.string({ message: "描述不能为空" }).min(1, "描述不能为空"),
    relativeTheme: z.string({ message: "主题不能为空" }).min(1, "主题不能为空"),
    tap: z.array(z.string({ message: "标签不能为空" })).min(1, "标签不能为空"),
  });
  const form = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
    defaultValues: defaultValue,
  });
  const onSubmit = (datas: z.infer<typeof zod>) => {
    if (isLoading) return;
    if (data?.length) {
      console.log(datas);
    }
  };
  return (
    <ScrollArea className="h-[calc(100dvh-100px)]">
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <Label htmlFor="title"> 标题 </Label>
          <Input {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="relativeTheme" className="flex items-center gap-2">
            <span> 主题 </span>
            {preview?.image && (
              <div className="flex items-center gap-2">
                <PhotoProvider>
                  <PhotoView src={preview.image}>
                    <Badge variant="outline">预览模板图片</Badge>
                  </PhotoView>
                </PhotoProvider>
              </div>
            )}
          </Label>
          {!isLoading ? (
            <Select
              onValueChange={(value) => {
                const fabricData = data?.find((item) => item.id === value);
                form.setValue("relativeTheme", value);
                setPreview(fabricData as Board);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分享模板" />
              </SelectTrigger>
              <SelectContent>
                {data?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Skeleton className="h-10 w-full"></Skeleton>
          )}
          {form.formState.errors.relativeTheme && (
            <p className="text-red-500">
              {form.formState.errors.relativeTheme.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="explanation"> 描述 </Label>
          <Edit
            content={defaultValue?.explanation || ""}
            setValue={form.setValue}
            setError={form.setError}
          />
        </div>
        <div>
          <Label htmlFor="tap"> 标签 </Label>
          {!tapLoading ? (
            tapData?.map((item) => (
              <div key={item.tag} className="flex items-center gap-2">
                <Checkbox
                  value={item.tag}
                  checked={form.getValues("tap").includes(item.tag)}
                  onCheckedChange={(checked) => {
                    form.setValue(
                      "tap",
                      checked
                        ? [...form.getValues("tap"), item.tag]
                        : form
                            .getValues("tap")
                            .filter((tag) => tag !== item.tag)
                    );
                  }}
                >
                  {item.tag}
                </Checkbox>
              </div>
            ))
          ) : (
            <Skeleton className="h-10 w-full"></Skeleton>
          )}
          {!tapLoading && (
            <>
              {!isModal ? (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button" onClick={() => {}}>
                      创建标签
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>创建标签</DialogTitle>
                    </DialogHeader>

                    <Input placeholder="请输入标签" />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          取消
                        </Button>
                      </DialogClose>
                      <Button type="button">创建</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger asChild>
                    <Button type="button" variant="outline">
                      创建标签
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>创建标签</DrawerTitle>
                      <DrawerDescription></DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="pt-2">
                      <DrawerClose asChild>
                        <Button variant="outline">关闭</Button>
                      </DrawerClose>
                      <Button type="button">创建</Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </>
          )}
        </div>
        {form.formState.errors.tap && (
          <p className="text-red-500">{form.formState.errors.tap.message}</p>
        )}
        {isLoading || tapLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Button type="submit" variant="outline" disabled={!data?.length}>
            {data?.length ? "创建" : "无模板请先创建模板"}
          </Button>
        )}
      </form>
    </ScrollArea>
  );
};

export default Form;
