import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store/user';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%);
`;

const Hero = styled.div`
  text-align: center;
  max-width: 800px;
  margin-bottom: 6rem;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #4b5563;
  margin-bottom: 3rem;
  line-height: 1.7;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #f0f4ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #2563eb;
`;

const FeatureTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const FeatureDescription = styled.p`
  color: #4b5563;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const CTAButton = styled(Button)`
  font-size: 1.2rem;
  padding: 1.25rem 2.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
  }
`;

const Home = observer(() => {
  const navigate = useNavigate();
  const store = useStore;

  const handleGetStarted = () => {
    if (store.userData) navigate('/dashboard');
    else navigate('/sign-in');
  };

  return (
    <HomeContainer>
      <Hero>
        <Title>让项目管理更简单</Title>
        <Subtitle>
          Jebet
          为现代团队打造的一站式项目管理平台，助力团队提升效率、加速项目进程
        </Subtitle>
        <CTAButton onClick={handleGetStarted}>
          {store.userData ? '进入工作台' : '免费开始使用'}
        </CTAButton>
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>智能工作区</FeatureTitle>
          <FeatureDescription>
            灵活创建多个独立工作区，支持团队、项目分组管理，让工作井然有序
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📈</FeatureIcon>
          <FeatureTitle>项目追踪</FeatureTitle>
          <FeatureDescription>
            多维度项目视图，支持看板、甘特图、时间线等，轻松掌控项目全局
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>团队协作</FeatureTitle>
          <FeatureDescription>
            实时团队协作，任务分配、进度更新、文件共享，让沟通更高效
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </HomeContainer>
  );
});

export default Home;
