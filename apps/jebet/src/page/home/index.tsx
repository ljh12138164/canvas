import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/image/logo.jpg';

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border);
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 2rem;
`;

const Brand = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #007cf0, #00dfd8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 6rem 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--muted-foreground);
  margin-bottom: 2rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background-color: var(--secondary);
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background-color: var(--background);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: var(--muted-foreground);
  line-height: 1.6;
`;

const features = [
  {
    title: '团队协作',
    description: '实时协作工具，让团队成员随时保持联系，提高工作效率',
    icon: '👥',
  },
  {
    title: '项目管理',
    description: '直观的项目跟踪和任务管理，让项目进度一目了然',
    icon: '📊',
  },
  {
    title: '数据分析',
    description: '强大的数据分析工具，助你做出更明智的决策',
    icon: '📈',
  },
  {
    title: '安全可靠',
    description: '安全可靠的数据存储和备份机制',
    icon: '🔒',
  },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container>
      <Nav>
        <NavLeft>
          <Logo src={logo} alt="Logo" />
          <Brand>ljh-jebet</Brand>
        </NavLeft>
      </Nav>

      <HeroSection>
        <Title>欢迎使用 ljh-jebet</Title>
        <Subtitle>一个现代化的项目管理平台，帮助团队更高效地协作与创新</Subtitle>
        <Button size="lg" onClick={() => navigate('/dashboard')}>
          立即开始
        </Button>
      </HeroSection>

      <FeatureGrid>
        {features.map((feature) => (
          <FeatureCard key={feature.title}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Container>
  );
}
