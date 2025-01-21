import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeroSection = styled.section`
  text-align: center;
  max-width: 800px;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const FeatureCard = styled(Card)`
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  line-height: 1.5;
`;

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container>
      <HeroSection>
        <Title>欢迎使用 ljh-jebet</Title>
        <Subtitle>一个现代化的项目管理平台，帮助团队更高效地协作与创新</Subtitle>
        <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
          立即开始
        </Button>
      </HeroSection>

      <FeatureGrid>
        <FeatureCard>
          <CardContent>
            <FeatureTitle>团队协作</FeatureTitle>
            <FeatureDescription>实时协作工具，让团队成员随时保持联系，提高工作效率</FeatureDescription>
          </CardContent>
        </FeatureCard>

        <FeatureCard>
          <CardContent>
            <FeatureTitle>项目管理</FeatureTitle>
            <FeatureDescription>直观的项目跟踪和任务管理，让项目进度一目了然</FeatureDescription>
          </CardContent>
        </FeatureCard>

        <FeatureCard>
          <CardContent>
            <FeatureTitle>数据分析</FeatureTitle>
            <FeatureDescription>强大的数据分析工具，助你做出更明智的决策</FeatureDescription>
          </CardContent>
        </FeatureCard>
      </FeatureGrid>
    </Container>
  );
}
