import { ScrollArea } from '@/components/ui/scrollArea';
import { Suspensed, SuspensedChild } from '@/page/suspense';
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Index from '../page/error/Index';
import Task from '@/page/dashboard/project/task';

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
const Chat = lazy(() => import('../page/chat/Chat'));
const Storage = lazy(() => import('../page/storage'));
const Homes = lazy(() => import('../page/home'));
const Flow = lazy(() => import('../page/flow'));
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
    element: <Homes />,
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
          <SuspensedChild>
            <Home />
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/create',
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
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Navigate to='home' replace />,
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/home',
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
      {
        path: '/dashboard/:workspaceId/flow',
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Flow />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId',
        element: (
          <SuspensedChild>
            <WorkContains>
              <Scroll>
                <Navigate to='home' replace />
              </Scroll>
            </WorkContains>
          </SuspensedChild>
        ),
      },
      {
        path: '/dashboard/:workspaceId/:projectId/home',
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
    element: <Index />,
  },
]);
