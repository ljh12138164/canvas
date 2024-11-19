import { client } from "@/server";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import styled from "styled-components";
// import { ThemeToggle } from "../../components/command/Theme";
import Router from "@/components/board/Router";
import Logo from "@/components/command/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
const Container = styled.div`
  display: flex;
`;
const Asider = styled.aside`
  flex-basis: 250px;
  width: 250px;
  height: 100vh;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid hsl(var(--border));
  overflow: hidden;
`;
const Main = styled.main`
  flex: 1;
  border-radius: var(--radius);
  padding: 2px;
`;
const RouterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const RouterDiv = styled(Button)`
  width: 100%;
  background-color: aliceblue;
  border-radius: var(--radius);
  padding: 1px;
  color: white;
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
export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  useEffect(() => {
    // console.log(user);
    if (!isLoaded || !isSignedIn || !user) return;

    (async () => {
      const data = await client.board.$get();
      const json = await data.json();
      console.log(json);
    })();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded)
    return (
      <Container>
        <Asider>
          <RouterContainer>
            <Logo />
            <Router to="/dashboard/home">
              <RouterDiv>HOME</RouterDiv>
            </Router>
            <Router to="/dashboard/home">
              <RouterDiv>HOME</RouterDiv>
            </Router>
            <Router to="/dashboard/home">
              <RouterDiv>HOME</RouterDiv>
            </Router>
            <Router to="/dashboard/home">
              <RouterDiv>HOME</RouterDiv>
            </Router>
          </RouterContainer>
          {/*  */}
          {/* <SignedIn>
            <UserButton />
          </SignedIn> */}
          {/* <ThemeToggle /> */}
        </Asider>
        <Main>加载中...</Main>
      </Container>
    );

  if (!isSignedIn) return <Navigate to="/sign-in" />;
  console.log(user);
  return (
    <Container>
      <Asider>
        <RouterContainer>
          <Logo />
          <Separator />
          <Router to="/dashboard/home">
            <RouterDiv>HOME</RouterDiv>
          </Router>
          <Router to="/dashboard/home">
            <RouterDiv>HOME</RouterDiv>
          </Router>
          <Router to="/dashboard/home">
            <RouterDiv>HOME</RouterDiv>
          </Router>
          <Router to="/dashboard/home">
            <RouterDiv>HOME</RouterDiv>
          </Router>
        </RouterContainer>
        <UserButtonContainer>
          <SignedIn>
            <UserButton
              userProfileProps={{
                appearance: {
                  elements: {
                    rootBox: {
                      width: "100%",
                      height: "100%",
                    },
                  },
                },
              }}
            />
          </SignedIn>
          <UserDataContainer>
            <NameText>{user.username}</NameText>
            <EmailText>{user.emailAddresses[0].emailAddress}</EmailText>
          </UserDataContainer>
        </UserButtonContainer>
        {/* <ThemeToggle /> */}
      </Asider>
      <Main>{!isLoaded && <Outlet></Outlet>}</Main>
    </Container>
  );
}
