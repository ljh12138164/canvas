import Router from "@/components/board/Router";
import Logo from "@/components/command/Logo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ui/theme-provider";
import { useWorkspace } from "@/server/hooks/board";
import userStore from "@/store/user";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { UserResource } from "@clerk/types";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { LuSettings, LuUsers2 } from "react-icons/lu";
import { TfiMenuAlt } from "react-icons/tfi";
import { useLocation, useNavigate } from "react-router-dom";

import DrawerFromCard from "@/components/board/DrawerFromCard";
import styled from "styled-components";
const Asider = styled.aside`
  flex-basis: 250px;
  width: 100%;
  height: 100%;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;
const RouterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const RouterDiv = styled(Button)<{ theme: boolean; active: boolean }>`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  border-radius: var(--radius);
  background-color: ${(props) =>
    props.active ? (props.theme ? "white" : "#1c1c22") : "#e5e7eba0"};
  padding: 1px;
  transition: all 0.2s;
  &:hover {
    background-color: ${(props) =>
      props.theme ? "white" : props.active ? "#1c1c22" : "#e5e7eba0"};
    color: ${(props) => (props.theme ? "black" : "white")};
  }
`;
const UserButtonContainer = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  border: 1px solid hsl(var(--border));
  gap: 20px;
`;
const UserDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const EmailText = styled.p`
  font-size: 0.8rem;
  color: hsl(var(--muted-foreground));
`;
const NameText = styled.p`
  font-size: 0.8rem;
`;
const ButtonContainer = styled.p`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0 1rem;
  gap: 10px;
`;
const Title = styled.h1`
  font-size: 1rem;
  opacity: 0.5;
  margin: 0;
`;
const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  height: 4rem;
  border: 2px solid hsl(var(--border));
  border-radius: var(--radius);
`;

const LoadingP = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SelectItems = styled(SelectItem)`
  display: flex;
  transition: all 0.2s;
  padding-left: 1rem;
  &:hover {
    background-color: #e5e7eba0;
  }
`;
const SelectImage = styled.img`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 4px;
`;
const TitleP = styled.p`
  font-size: 1rem;
  opacity: 0.5;
  margin: 0;
`;
const TitleContain = styled.section`
  display: flex;
  justify-content: space-between;
`;

const SiderBar = observer(({ user }: { user: UserResource }) => {
  const router = useLocation();
  const navigate = useNavigate();
  const { isLoading, data, error } = useWorkspace(user.id);
  // const location = useLocation();

  useEffect(() => {
    if (isLoading || error) return;
    if (data) {
      userStore.setWorkspace(data);
    }
  }, [data, isLoading, error]);
  // const [isLoadings, setLoadings] = useState(true);

  const { theme } = useTheme();
  return (
    <Asider>
      <RouterContainer>
        <div>
          <Logo />
        </div>
        <TitleContain>
          <TitleP>工作区</TitleP>
          <DrawerFromCard></DrawerFromCard>
        </TitleContain>
        <SelectContainer>
          {isLoading && !error && <LoadingP>加载中</LoadingP>}
          {!isLoading && !error && (
            <Select
              onValueChange={(value) => {
                userStore.setActiveWorkSpace(
                  data?.find((item) => item.id === value) || null
                );
                navigate(`/dashboard/${value}`);
              }}
              value={
                data?.find((item) => item.id === router.pathname.split("/")[2])
                  ?.id
              }
            >
              <SelectTrigger className="w-full h-full  dark:hover:bg-slate-900 hover:bg-slate-100 transition-all duration-200">
                <SelectValue placeholder="选择工作区" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {data?.map((item) => (
                    <SelectItems key={item.id} value={item.id}>
                      <div className="flex items-center justify-start gap-2 ">
                        <SelectImage src={item.imageUrl} alt={item.name} />
                        <p>{item.name}</p>
                      </div>
                    </SelectItems>
                  ))}
                  {data?.length === 0 && !isLoading && <p>无数据，请创建</p>}
                  {isLoading && <p>加载中</p>}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {error && <div>获取失败</div>}
        </SelectContainer>
        <Title>菜单</Title>
        <Router to="/dashboard/home">
          <RouterDiv
            active={router.pathname === "/dashboard/home"}
            variant="ghost"
            theme={theme === "light"}
            className={
              router.pathname === "/dashboard/home"
                ? `text-black font-semibold border-2 border-[${
                    theme === "light" ? "#ebf0fa" : "#1c1c22"
                  }]`
                : `opacity-80 ${
                    theme === "light" ? "text-black" : "text-white bg-white"
                  }`
            }
            asChild
          >
            <ButtonContainer>
              <TfiMenuAlt />
              <span>主页</span>
            </ButtonContainer>
          </RouterDiv>
        </Router>
        <Router to="/dashboard/member">
          <RouterDiv
            active={router.pathname === "/dashboard/member"}
            variant="ghost"
            theme={theme === "light"}
            className={
              router.pathname === "/dashboard/member"
                ? `text-black font-semibold border-2 border-[${
                    theme === "light" ? "#ebf0fa" : "#1c1c22"
                  }]`
                : `opacity-80 ${
                    theme === "light" ? "text-black" : "text-white"
                  }`
            }
            asChild
          >
            <ButtonContainer>
              <LuUsers2 />
              <span>成员</span>
            </ButtonContainer>
          </RouterDiv>
        </Router>
        <Router to="/dashboard/setting">
          <RouterDiv
            active={router.pathname === "/dashboard/setting"}
            variant="ghost"
            theme={theme === "light"}
            className={
              router.pathname === "/dashboard/setting"
                ? `text-black font-semibold border-2 border-[${
                    theme === "light" ? "#ebf0fa" : "#1c1c22"
                  }]`
                : `opacity-80 ${
                    theme === "light" ? "text-black" : "text-white"
                  }`
            }
            asChild
          >
            <ButtonContainer>
              <LuSettings />
              <span>设置</span>
            </ButtonContainer>
          </RouterDiv>
        </Router>
        <Separator />
      </RouterContainer>
      <UserButtonContainer>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <UserDataContainer>
          <NameText>{user.username}</NameText>
          <EmailText>{user.emailAddresses[0].emailAddress}</EmailText>
        </UserDataContainer>
        <div>sdf</div>
      </UserButtonContainer>
    </Asider>
  );
});

export default SiderBar;
