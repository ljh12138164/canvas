import { useCreateWorkspace, useUpdateWorkspace } from "@/server/hooks/board";
import { DEFAULT_ICON } from "@/utils/board";
import { UserResource } from "@clerk/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, RefObject, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const zodShema = z.object({
  name: z.string().min(1, { message: "仪表盘名称不能为空" }),
  file: z.any().optional(),
});
const Footer = styled.div<{ type: "create" | "edit" }>`
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: ${({ type }) =>
    type === "edit" ? "flex-end" : "space-between"};
`;
const ImageContent = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
`;
const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
`;
const UploadP = styled.p`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
`;
const ButtonContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FromCard = ({
  type = "create",
  Back,
  editId,
  // workspace,
  showFooter = true,
  defaultFrom,
  userData,
  closeRef,
}: {
  Back?: boolean;
  // workspace: Workspace;
  editId?: string;
  type?: "create" | "edit";
  showFooter?: boolean;
  defaultFrom?: {
    name: string;
    file: string;
  };
  userData: UserResource;
  closeRef?: RefObject<HTMLButtonElement | null>;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const params = useParams();
  const [file, setFile] = useState<string>(defaultFrom?.file || "");
  const { createWorkspace, isCreating } = useCreateWorkspace(userData.id);
  const { updateWorkspace, isUpdating } = useUpdateWorkspace();
  const navigator = useNavigate();
  const { register, handleSubmit, formState, setError, getValues, setValue } =
    useForm({
      resolver: zodResolver(zodShema),
      defaultValues: {
        name: defaultFrom?.name || "",
        file: defaultFrom?.file || DEFAULT_ICON,
      },
    });

  const onSubmit = (data: z.infer<typeof zodShema>) => {
    if (data.file instanceof File) {
      if (data.file.size > 1024 * 1024 * 5) {
        setError("file", {
          message: "文件过大重新上传",
        });
      }
    }
    if (!data?.file) {
      data.file = DEFAULT_ICON;
    }

    if (!userData) return;
    if (type === "create") {
      createWorkspace(
        {
          form: { ...data, userId: userData.id },
        },
        {
          onSuccess: (data) => {
            closeRef?.current?.click();
            queryClient.setQueryData(["workspace", userData.id], data);
            navigator(`/dashboard/${data.id}`);
          },
        }
      );
    } else {
      if (defaultFrom?.file === data.file && defaultFrom?.name === data.name) {
        toast.dismiss();
        toast.success("更新成功");
        return;
      }
      if (editId) {
        updateWorkspace(
          {
            form: {
              ...data,
              id: editId,
              userId: userData.id,
              oldImageUrl: defaultFrom?.file || DEFAULT_ICON,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["workspace", userData.id],
              });
              toast.dismiss();
              toast.success("更新成功");
            },
          }
        );
      }
    }
  };

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(URL.createObjectURL(file));
      // @ts-ignore
      setValue("file", file);
    }
    e.target.value = "";
  }

  return (
    <div className="w-full">
      <CardHeader className="flex flex-row gap-4 items-center">
        {Back && (
          <Button
            className="w-16 h-full"
            variant="outline"
            onClick={() => navigator(`/dashboard/${params.workspaceId || ""}`)}
          >
            返回
          </Button>
        )}
        <div>
          <CardTitle>
            {type === "create" ? "创建你仪表盘" : "更新仪表盘"}
          </CardTitle>
          <CardDescription>
            {type === "create"
              ? "创建仪表盘，开始管理你的项目"
              : "更新仪表盘，管理你的项目"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-xl mb-4" htmlFor="name">
            仪表盘名称
          </label>
          <Input
            className={`${formState.errors.name ? "border-red-500" : ""}`}
            id="name"
            {...register("name")}
          />
          <p className="text-red-500">{formState.errors.name?.message}</p>

          <ImageContent>
            <Image src={file || getValues("file")} alt="icon" />
            <UploadP>
              <span className="text-xl">工作区图标</span>
              <span className="text-slate-500/50 dark:text-slate-400/50">
                支持jpg、png、jpeg、svg格式，大小不超过5M
                <span className="text-red-500">{}</span>
              </span>
              <ButtonContent>
                <Button
                  className="w-32"
                  type="button"
                  variant="outline"
                  onClick={(event) => {
                    event.preventDefault();
                    if (fileRef.current) {
                      fileRef.current.click();
                    }
                  }}
                >
                  点击上传
                </Button>
                <Button
                  type="button"
                  className="transition-all duration-300"
                  variant="destructive"
                  onClick={() => {
                    setFile("");
                    setValue("file", defaultFrom?.file || DEFAULT_ICON);
                  }}
                >
                  重置图片
                </Button>
              </ButtonContent>
            </UploadP>
          </ImageContent>
          <Separator className="mt-6"></Separator>
          <Input
            {...register("file", { onChange: handleFileChange })}
            accept=".jpg,.png,.jpeg,.svg"
            id="file"
            ref={fileRef}
            type="file"
            className="hidden"
          />
          {showFooter && (
            <Footer type={type}>
              {type === "create" && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    console.log(closeRef?.current);
                    closeRef?.current?.click();
                  }}
                >
                  取消
                </Button>
              )}
              <Button
                variant="primary"
                type="submit"
                className="dark:text-white"
                disabled={isCreating || isUpdating}
              >
                {isCreating
                  ? "创建中..."
                  : isUpdating
                    ? "更新中..."
                    : type === "create"
                      ? "创建仪表盘"
                      : "更新仪表盘"}
              </Button>
            </Footer>
          )}
        </form>
      </CardContent>
    </div>
  );
};

export default FromCard;
