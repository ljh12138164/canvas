import SignInContain from "@/components/auth/SignInContain";
import Logo from "@/components/command/Logo";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
const Main = styled.main`
  background-color: #f5f5f5;
  min-height: 100vh;
`;
const Section = styled.section`
  max-width: 1536px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
`;
const Nav = styled.nav`
  display: flex;

  justify-content: space-between;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    padding-top: 2rem;
  }
`;
const SignIn = () => {
  return (
    <Main>
      <Section>
        {/* 头部  */}
        <Nav>
          <Logo width={200} height={50}></Logo>
          <Button variant="secondary">登录</Button>
        </Nav>
        {/* 主体内容 */}
        <MainContainer>
          <SignInContain />
        </MainContainer>
      </Section>
    </Main>
  );
};

export default SignIn;
