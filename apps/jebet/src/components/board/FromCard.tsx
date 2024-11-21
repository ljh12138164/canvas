import { useCreateWorkspace, useUpdateWorkspace } from "@/server/hooks/board";
import { DEFAULT_ICON } from "@/utils/board";
import { UserResource } from "@clerk/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, RefObject, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { Button } from "../ui/button";
import userStore from "@/store/user";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Workspace } from "@/types/workspace";
const zodShema = z.object({
  name: z.string().min(1, { message: "仪表盘名称不能为空" }),
  file: z.any().optional(),
});
const Footer = styled.div`
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
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
  editId,
  // workspace,
  showFooter = true,
  defaultFrom,
  userData,
  closeRef,
}: {
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
  const [file, setFile] = useState<string>(defaultFrom?.file || "");
  const { createWorkspace, isCreating } = useCreateWorkspace();
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
            userStore.setActiveWorkSpace(data);
            navigator(`/dashboard/${data.id}`);
          },
        }
      );
    } else {
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
            onSuccess: (data) => {
              const oldData = queryClient.getQueryData([
                "workspace",
                userData.id,
              ]) as Workspace[];
              const oldWorkspaceIndex = oldData?.findIndex(
                (item) => item.id === editId
              );
              oldData[oldWorkspaceIndex] = data;
              queryClient.setQueryData(["workspace", userData.id], oldData);
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
      <CardHeader>
        <CardTitle>创建你仪表盘</CardTitle>
        <CardDescription>创建仪表盘，开始管理你的项目</CardDescription>
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
            <Footer>
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
