import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import { ThemeToggle } from "../../components/command/Theme";
import userStore from '@/store/user';
import { ThemeToggle } from '@/components/command/Theme';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/ui/theme-provider';
import { observer } from 'mobx-react-lite';
import { TfiMenuAlt } from 'react-icons/tfi';
import SiderBar from '../../components/board/SiderBar';

const Container = styled.div`
  display: flex;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
`;
const Media = styled.div`
  width: 250px;
  height: 100vh;
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
  background-color: ${(props) =>
    props.theme === 'light' ? 'white' : '#191924'};
`;
const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const App = observer(() => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { theme } = useTheme();

  const router = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (router.pathname === '/dashboard') {
      navigate('/dashboard/home');
    }
  }, [router, navigate]);
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    userStore.setUserData(user);
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return;
  // return (
  //   <Container className="bg-[#fafafa]">
  //     <Asider className="bg-[#fafafa]">
  //       <RouterContainer>
  //         <div>
  //           <Logo />
  //           <Separator className="mt-6" />
  //         </div>
  //         <Router to="/dashboard/home">
  //           <RouterDiv
  //             variant="ghost"
  //             className={
  //               router.pathname === "/dashboard/home" ? "bg-white " : ""
  //             }
  //           >
  //             HOME
  //           </RouterDiv>
  //         </Router>
  //         <Router to="/dashboard/home">
  //           <RouterDiv
  //             variant="ghost"
  //             className={
  //               router.pathname === "/dashboard/home"
  //                 ? "bg-white text-[#676767]"
  //                 : "text-[#c4c9d2]"
  //             }
  //           >
  //             HOME
  //           </RouterDiv>
  //         </Router>
  //         <Router to="/dashboard/home">
  //           <RouterDiv
  //             variant="ghost"
  //             className={
  //               router.pathname === "/dashboard/home"
  //                 ? "bg-white text-[#676767]"
  //                 : "text-[#c4c9d2]"
  //             }
  //           >
  //             HOME
  //           </RouterDiv>
  //         </Router>
  //         <Router to="/dashboard/home">
  //           <RouterDiv
  //             variant="ghost"
  //             className={
  //               router.pathname === "/dashboard/home"
  //                 ? "bg-white text-[#676767]"
  //                 : "text-[#c4c9d2]"
  //             }
  //           >
  //             HOME
  //           </RouterDiv>
  //         </Router>
  //         <Separator />
  //       </RouterContainer>
  //       {/* TODO:龙骨架 */}
  //     </Asider>
  //     <Main>加载中...</Main>
  //   </Container>
  // );

  if (!isSignedIn) return <Navigate to='/sign-in' />;
  return (
    <Container className='bg-[#e5e7eba0] dark:bg-[#1c1c22]'>
      <Media>
        <SiderBar user={user} />
      </Media>
      <Main>
        <MainContainer theme={theme}>
          <MainHeader>
            <Mobile>
              <Sheet>
                <SheetTrigger>
                  <TfiMenuAlt />
                </SheetTrigger>
                <SheetContent side='left'>
                  <SiderBar user={user} />
                </SheetContent>
              </Sheet>
            </Mobile>
            <div className='flex flex-row w-full items-center justify-end md:justify-between'>
              <ThemeToggle />
              <UserButton />
            </div>
          </MainHeader>
          <Separator className='my-2' />
          <Outlet />
        </MainContainer>
      </Main>
    </Container>
  );
});
export default App;
