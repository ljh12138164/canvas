import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import styled from "styled-components";
import { Separator } from "../ui/separator";
const Container = styled(Card)`
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: none;

  @media (min-width: 768px) {
    width: 487px;
  }
`;
const Header = styled(CardHeader)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
`;

const Title = styled(CardTitle)`
  font-size: 1rem;
`;
const Content = styled(CardContent)`
  padding: 1.5rem;
`;
const SeparatorLine = styled.div`
  padding: 2rem 0;
  margin-bottom: 1rem;
`;
const SignInContain = () => {
  return (
    <Container>
      <Header>
        <Title>欢迎回来</Title>
      </Header>
      <SeparatorLine>
        <Separator />
      </SeparatorLine>
      <Content></Content>
    </Container>
  );
};

export default SignInContain;
