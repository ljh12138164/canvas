import { useJoinWorkspace, useUserJoinWorkspace } from "@/server/hooks/board";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import { Separator } from "../ui/separator";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
const Footer = styled(CardFooter)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
`;
const Label = styled.p`
  font-size: 1rem;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Container = styled.section`
  display: grid;
  grid-template-columns: 1fr 10px 1fr;
`;
const JoinWorkspaceCard = ({ id, userId }: { id: string; userId: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, data, error } = useJoinWorkspace(id);
  const { joinWorkspace, isJoining } = useUserJoinWorkspace();
  if (isLoading) return <div>loading</div>;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>没有数据</div>;

  const handleJoin = () => {
    joinWorkspace(
      { json: { userId, id: data.id } },
      {
        onSuccess: () => {
          toast.success("加入成功");
          queryClient.invalidateQueries({ queryKey: ["workspace", userId] });
          navigate(`/dashboard/${data.id}`);
        },
      }
    );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>加入工作区</CardTitle>
        <CardDescription>你确定要加入{data.name}工作区吗？</CardDescription>
      </CardHeader>
      <CardContent>
        <Container>
          <Item>
            <Label>工作区图标</Label>
            <Image src={data.imageUrl}></Image>
          </Item>
          <Separator orientation="vertical"></Separator>
          <LeftContainer>
            <Item>
              <Label>工作区名字</Label>
              <Input value={data.name} disabled></Input>
            </Item>
            <Item>
              <Label>工作区创建时间</Label>
              <p>{dayjs(data["created_at"]).format("YYYY-MM-DD HH:mm:ss")}</p>
            </Item>
          </LeftContainer>
        </Container>
        <Separator className="my-4"></Separator>
        <Footer>
          <Button
            size="lg"
            className="w-full"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
          <Button
            size="lg"
            className="w-full"
            onClick={handleJoin}
            disabled={isJoining}
          >
            加入
          </Button>
        </Footer>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceCard;
