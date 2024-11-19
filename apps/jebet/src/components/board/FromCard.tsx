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
const zodShema = z.object({
  name: z.string().min(1, { message: "仪表盘名称不能为空" }),
});
const Footer = styled.div`
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const FromCard = observer(() => {
  const { userData } = userStore;
  const { createWorkspace, isCreating } = useCreateWorkspace();
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(zodShema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof zodShema>) => {
    console.log(data);
    if (!userData) return;
    createWorkspace({ ...data, userId: userData.id });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>创建你第一个仪表盘</CardTitle>
        <CardDescription>创建一个仪表盘，开始管理你的项目</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">仪表盘名称</label>
          <Input id="name" {...register("name")} />
          <p className="text-red-500">{formState.errors.name?.message}</p>
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
