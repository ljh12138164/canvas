import { ScrollArea } from '@/components/ui/scrollArea';
import { Suspensed, SuspensedChild } from '@/page/suspense';
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import Index from '../page/error/Index';

const Task = lazy(() => import('../page/dashboard/project/task'));
const SignIn = lazy(() => import('../page/auth/SignIn'));
const Homes = lazy(() => import('../page/home'));
const Member = lazy(() => import('../page/dashboard/member'));
const Home = lazy(() => import('../page/dashboard/home'));
const Dashboard = lazy(() => import('../page/dashboard'));
const WorkSpace = lazy(() => import('../page/dashboard/workspace'));
const Join = lazy(() => import('../page/dashboard/join/index'));
const Project = lazy(() => import('../page/dashboard/project'));
const ProjectSetting = lazy(() => import('../page/dashboard/project/setting'));
const Create = lazy(() => import('../page/dashboard/create'));
const Setting = lazy(() => import('../page/dashboard/setting'));
const WorkspaceSetting = lazy(() => import('../page/dashboard/workspace/setting'));
const Chat = lazy(() => import('../page/chat/Chat'));
const Storage = lazy(() => import('../page/storage'));
// const Flow = lazy(() => import('../page/flow'));
// const FlowDetail = lazy(() => import('../page/flow/detail'));
const Detail = lazy(() => import('../page/dashboard/detail'));
const WorkContains = styled.div`
  width: calc(100dvw - 280px);
  height: calc(100dvh - 93.4px);
  min-width: 365px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: calc(100dvw - 50px);
  }
`;
const Scroll = styled(ScrollArea)`
  width: 100%;
  height: 100%;
  padding: 0%.5 0;
`;
export const router = createBrowserRouter([
  {
    path: '/',
    handle: {
      crumb: () => '首页',
      title: '首页 - Jebet',
      description: 'Jebet首页页面,管理您的项目和团队,提高工作效率',
      keywords: 'Jebet,首页,项目管理,团队协作,工作效率',
    },
    element: <Homes />,
  },
  {
    path: '/sign-in',
    handle: {
      crumb: () => '登录',
      title: '登录 - Jebet',
      description: 'Jebet登录页面,管理您的项目和团队,提高工作效率',
      keywords: 'Jebet,登录,项目管理,团队协作,工作效率',
    },
    element: (
      <Suspensed type="sign">
        <SignIn />
      </Suspensed>
    ),
  },
  {
    path: '/dashboard',
    handle: {
      crumb: () => '仪表盘',
      title: '仪表盘 - Jebet',
      description: 'Jebet仪表盘页面,管理您的项目和团队,提高工作效率',
      keywords: 'Jebet,仪表盘,项目管理,团队协作,工作效率',
    },
    element: (
      <Suspensed>
        <Dashboard />
      </Suspensed>
    ),
    children: [
      {
        path: '/dashboard/home',
        handle: {
          crumb: () => '首页',
          title: '首页 - Jebet',
          description: 'Jebet首页页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,首页,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <Home />
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/create',
        handle: {
          crumb: () => '创建',
          title: '创建 - Jebet',
          description: 'Jebet创建页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,创建,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Create />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId',
        handle: {
          crumb: () => '工作区',
          title: '工作区 - Jebet',
          description: 'Jebet工作区页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,工作区,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Navigate to="home" replace />,
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/home',
        handle: {
          crumb: () => '工作区',
          title: '工作区 - Jebet',
          description: 'Jebet工作区页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,工作区,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <WorkSpace />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/setting',
        handle: {
          crumb: () => '设置',
          title: '设置 - Jebet',
          description: 'Jebet设置页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,设置,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <WorkspaceSetting />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/member',
        handle: {
          crumb: () => '成员',
          title: '成员 - Jebet',
          description: 'Jebet成员页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,成员,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Member />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/chat',
        handle: {
          crumb: () => '聊天',
          title: '聊天 - Jebet',
          description: 'Jebet聊天页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,聊天,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Chat />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/storage',
        handle: {
          crumb: () => '存储',
          title: '存储 - Jebet',
          description: 'Jebet存储页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,存储,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Storage />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/setting',
        handle: {
          crumb: () => '设置',
          title: '设置 - Jebet',
          description: 'Jebet设置页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,设置,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Setting />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      // {
      //   path: '/dashboard/:workspaceId/flow',
      //   element: (
      //     <SuspensedChild>
      //       <WorkContains>
      //         <Scroll>
      //           <Flow />
      //         </Scroll>
      //       </WorkContains>
      //     </SuspensedChild>
      //   ),
      // },
      // {
      //   path: '/dashboard/:workspaceId/flow/detail/:flowId',
      //   element: (
      //     <SuspensedChild>
      //       <WorkContains>
      //         <Scroll>
      //           <FlowDetail />
      //         </Scroll>
      //       </WorkContains>
      //     </SuspensedChild>
      //   ),
      // },
      {
        path: '/dashboard/:workspaceId/:projectId',
        handle: {
          crumb: () => '项目',
          title: '项目 - Jebet',
          description: 'Jebet项目页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,项目,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Navigate to="home" replace />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId/home',
        handle: {
          crumb: () => '项目',
          title: '项目 - Jebet',
          description: 'Jebet项目页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,项目,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Project />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId/home/:taskId',
        handle: {
          crumb: () => '项目',
          title: '项目 - Jebet',
          description: 'Jebet项目页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,项目,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Detail />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId/setting',
        handle: {
          crumb: () => '设置',
          title: '设置 - Jebet',
          description: 'Jebet设置页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,设置,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <ProjectSetting />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId/:taskId',
        handle: {
          crumb: () => '任务',
          title: '任务 - Jebet',
          description: 'Jebet任务页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,任务,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Task />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/join/:id',
        handle: {
          crumb: () => '加入',
          title: '加入 - Jebet',
          description: 'Jebet加入页面,管理您的项目和团队,提高工作效率',
          keywords: 'Jebet,加入,项目管理,团队协作,工作效率',
        },
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Join />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
    ],
  },
  {
    path: '*',
    handle: {
      crumb: () => '错误',
      title: '错误 - Jebet',
      description: 'Jebet错误页面,管理您的项目和团队,提高工作效率',
      keywords: 'Jebet,错误,项目管理,团队协作,工作效率',
    },
    element: <Index />,
  },
]);
