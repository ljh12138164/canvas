import Router from "@/components/board/Router";
import Logo from "@/components/command/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ui/theme-provider";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { UserResource } from "@clerk/types";
import { TfiMenuAlt } from "react-icons/tfi";
import { useLocation } from "react-router-dom";
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
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0 0.7rem;
  gap: 10px;
`;
const Title = styled.h1`
  font-size: 1rem;
  opacity: 0.5;

  margin: 0;
`;
const SiderBar = ({ user }: { user: UserResource }) => {
  const router = useLocation();
  const { theme } = useTheme();
  return (
    <Asider>
      <RouterContainer>
        <div>
          <Logo />
        </div>
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
        <Router to="/dashboard/a">
          <RouterDiv
            active={router.pathname === "/dashboard/a"}
            variant="ghost"
            theme={theme === "light"}
            className={
              router.pathname === "/dashboard/a"
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
              <TfiMenuAlt />
              <span>HOME</span>
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
};

export default SiderBar;
