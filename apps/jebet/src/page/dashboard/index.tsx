import { ThemeToggle } from '@/components/command/Theme';
import UserBox from '@/components/command/UserBox';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/components/ui/theme-provider';
import { useUser } from '@/hooks/useUser';
// import { ThemeToggle } from "../../components/command/Theme";
import userStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { TfiMenuAlt } from 'react-icons/tfi';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SiderBar from '../../components/board/SiderBar';

const Container = styled.div`
  display: flex;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
`;
const Media = styled.div`
  width: 250px;
  height: 100dvh;
  @media (max-width: 768px) {
    display: none;
  }
`;
const Mobile = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const Main = styled.main`
  flex: 1;
  height: 100dvh;
  border-radius: var(--radius);
  padding: 0.8rem;
`;

const MainContainer = styled.div<{ theme: string }>`
  padding: 1rem;
  min-width: 360px;
  border-radius: 0.8rem;
  height: 100%;
  overflow: hidden;
  width: 100%;
  background-color: ${(props) => (props.theme === 'light' ? 'white' : '#191924')};
`;
const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const App = observer(() => {
  const { isLoading, isSignedIn, user } = useUser({ type: 'board', redirect: true });
  const { theme } = useTheme();
  const router = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (router.pathname === '/dashboard') navigate('/dashboard/home');
  }, [router, navigate]);
  useEffect(() => {
    if (!isLoading || !isSignedIn || !user) return;
    userStore.setUserData(user);
  }, [isLoading, isSignedIn, user]);
  if (isLoading) return <></>;
  // 未登录
  if (!isSignedIn) return <Navigate to="/sign-in" />;
  // 未获取到用户信息
  if (!user) return <Navigate to="/sign-in" />;
  return (
    <Container className="bg-[#e5e7eba0] dark:bg-[#1c1c22]">
      <Media>
        <SiderBar user={user!} />
      </Media>
      <Main>
        <MainContainer theme={theme}>
          <MainHeader>
            <Mobile>
              <Sheet>
                <SheetTrigger>
                  <TfiMenuAlt />
                </SheetTrigger>
                <SheetContent side="left">
                  <SiderBar user={user!} />
                </SheetContent>
              </Sheet>
            </Mobile>
            <div className="flex flex-row w-full items-center justify-end md:justify-between">
              <ThemeToggle />
              <UserBox user={user!} />
            </div>
          </MainHeader>
          <Separator className="my-2" />
          <Outlet />
        </MainContainer>
      </Main>
    </Container>
  );
});
export default App;
