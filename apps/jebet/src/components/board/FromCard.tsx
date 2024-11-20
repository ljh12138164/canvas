import { useCreateWorkspace } from "@/server/hooks/board";
import userStore from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { DEFAULT_ICON } from "@/utils/board";
import { ChangeEvent, useRef, useState } from "react";
import { Separator } from "../ui/separator";
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

const FromCard = observer(() => {
  const { userData } = userStore;
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string>("");
  const { createWorkspace, isCreating } = useCreateWorkspace();
  const { register, handleSubmit, formState, setError, getValues, setValue } =
    useForm({
      resolver: zodResolver(zodShema),
      defaultValues: {
        name: "",
        file: DEFAULT_ICON,
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
    createWorkspace({
      form: { ...data, userId: userData.id },
    });
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>创建你第一个仪表盘</CardTitle>
        <CardDescription>创建一个仪表盘，开始管理你的项目</CardDescription>
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
                    setValue("file", DEFAULT_ICON);
                  }}
                >
                  重置
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
          <Footer>
            <Button variant="outline">取消</Button>
            <Button
              variant="primary"
              type="submit"
              className="dark:text-white"
              disabled={isCreating}
            >
              {isCreating ? "创建中..." : "创建仪表盘"}
            </Button>
          </Footer>
        </form>
      </CardContent>
    </Card>
  );
});

export default FromCard;
