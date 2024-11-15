import { cn, indexDBChange } from "@/lib/utils";
import { BoardResponse } from "@/types/board";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction, useQueryClient } from "@tanstack/react-query";
import { RefObject } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { nanoid } from "nanoid";
export interface Board {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  json: string;
  height: number;
  url: string;
  width: number;
}
const zod = z.object({
  name: z
    .string({ message: "请输入画布名称" })
    .min(2, { message: "画布名称至少为2个字符" })
    .max(20, { message: "画布名称最多为20个字符" }),
  width: z
    .number({ message: "请输入画布宽度" })
    .min(1, { message: "画布宽度最小为1" })
    .max(1000000, { message: "画布宽度最大为1000000" }),
  height: z
    .number({ message: "请输入画布高度" })
    .min(1, { message: "画布高度最小为1" })
    .max(1000000, { message: "画布高度最大为1000000" }),
});
interface BoardCreateFromProps {
  type: "create" | "edit";
  children: React.ReactNode;
  defaultValues?: any;
  closeref: RefObject<HTMLButtonElement | null>;
  userId: string | undefined;
  setChange?: (change: boolean) => void;
  mutate:
    | UseMutateFunction<
        BoardResponse,
        Error,
        {
          name: string;
          width: number;
          height: number;
          json?: string;
        }
      >
    | undefined;
}
const BoardCreateFrom = ({
  type,
  children,
  closeref,
  setChange,
  userId,
  mutate,
  defaultValues,
}: BoardCreateFromProps) => {
  const query = useQueryClient();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          width: defaultValues.width,
          height: defaultValues.height,
        }
      : {
          name: "",
          width: 700,
          height: 1100,
        },
  });
  const onSubmit = (data: z.infer<typeof zod>) => {
    if (userId) {
      query.invalidateQueries({ queryKey: [userId] });
      toast.loading("创建中");
      if (mutate) {
        mutate(
          { ...data, json: "" },
          {
            onSuccess: () => {
              query.invalidateQueries({ queryKey: [userId] });
              toast.dismiss();
              toast.success(type === "create" ? "创建成功" : "更新成功");
              if (closeref?.current) {
                closeref.current.click();
              }
            },
            onError: (error) => {
              console.log(error);
              toast.dismiss();
              toast.error(type === "create" ? "创建失败" : "更新失败");
            },
          }
        );
      }
    } else {
      if (type === "create") {
        toast.loading("创建中");
        // TODO: INDEXDB
        indexDBChange({
          type: "add",
          data: {
            ...data,
            id: nanoid(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            json: "",
          },
        });
        if (setChange) {
          setChange(true);
        }
        toast.dismiss();
        toast.success("创建成功");
        if (closeref?.current) {
          closeref.current.click();
        }
      } else {
        toast.loading("修改中...");
        indexDBChange({
          type: "edit",
          editData: {
            ...defaultValues,
            ...data,
            updated_at: new Date().toISOString(),
          },
        });
        if (setChange) {
          setChange(true);
        }
        toast.dismiss();
        toast.success("修改成功");
        if (closeref?.current) {
          closeref.current.click();
        }
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" aria-label="画布名称">
          画布名称
        </Label>
        <Input
          id="name"
          className={cn(formState.errors.name && "border-red-500")}
          placeholder="请输入画布名称"
          {...register("name")}
        />
        <span
          className={cn(
            "transition-all duration-300 text-sm h-0 ml-2 text-red-500/70 font-[500]",
            formState.errors.name && "h-4"
          )}
        >
          {formState.errors.name?.message}
        </span>
      </div>
      <section className="flex gap-2 ">
        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="width" aria-label="画布宽度">
            画布宽度
          </Label>
          <Input
            className={cn(formState.errors.width && "border-red-500")}
            id="width"
            placeholder="请输入画布宽度"
            type="number"
            {...register("width")}
          />
          <span
            className={cn(
              "transition-all duration-300 text-sm h-0 ml-2 text-red-500/70 font-[500]",
              formState.errors.width && "h-4"
            )}
          >
            {formState.errors.width?.message}
          </span>
        </div>
        <div className="flex flex-col gap-2  flex-1">
          <Label htmlFor="height" aria-label="画布高度">
            画布高度
          </Label>
          <Input
            className={cn(formState.errors.height && "border-red-500")}
            id="height"
            placeholder="请输入画布高度"
            type="number"
            {...register("height")}
          />
          <span
            className={cn(
              "transition-all duration-300 text-sm h-0 ml-2 text-red-500/70 font-[500]",
              formState.errors.height && "h-4"
            )}
          >
            {formState.errors.height?.message}
          </span>
        </div>
      </section>
      <footer>{children}</footer>
    </form>
  );
};

export default BoardCreateFrom;
