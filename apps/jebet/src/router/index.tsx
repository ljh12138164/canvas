/* eslint-disable react-refresh/only-export-components */
import { ScrollArea } from '@/components/ui/scrollArea';
import Suspensed from '@/page/suspense';
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Index from '../page/error/Index';
const SignIn = lazy(() => import('../page/auth/SignIn'));
const Create = lazy(() => import('../page/dashboard/create'));
const Setting = lazy(() => import('../page/dashboard/setting'));
const WorkspaceSetting = lazy(
  () => import('../page/dashboard/workspace/setting')
);
const Member = lazy(() => import('../page/dashboard/member'));
const Home = lazy(() => import('../page/dashboard/home'));
const Dashboard = lazy(() => import('../page/dashboard'));
const WorkSpace = lazy(() => import('../page/dashboard/workspace'));
const Join = lazy(() => import('../page/dashboard/join/index'));
const Project = lazy(() => import('../page/dashboard/project'));
const ProjectSetting = lazy(() => import('../page/dashboard/project/setting'));
const WorkContains = styled.div`
  width: calc(100dvw - 280px);
  height: calc(100dvh - 93.4px);
  min-width: 365px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: calc(100dvw - 50px);
  }
`;
// 559-14-36--14.4-23
const Scroll = styled(ScrollArea)`
  width: 100%;
  height: 100%;
  padding: 1.5rem 0;
`;
export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>22</div>,
  },
  {
    path: '/sign-in',
    element: (
      <Suspensed>
        <SignIn />
      </Suspensed>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspensed>
        <Dashboard />
      </Suspensed>
    ),
    children: [
      {
        path: '/dashboard/home',
        element: (
          <Suspensed>
            <Home />
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/create',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Create />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Navigate to='home' replace />,
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId/home',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <WorkSpace />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId/setting',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <WorkspaceSetting />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId/member',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Member />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId/setting',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Setting />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Navigate to='home' replace />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId/home',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Project />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId/setting',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <ProjectSetting />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: '/dashboard/join/:id',
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Join />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
    ],
  },

  {
    path: '*',
    element: <Index />,
  },
]);
