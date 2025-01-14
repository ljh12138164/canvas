/* eslint-disable react-refresh/only-export-components */
import { ScrollArea } from "@/components/ui/scrollArea";
import Suspensed from "@/page/suspense";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import styled from "styled-components";
import Index from "../page/error/Index";
import Task from "@/page/dashboard/project/task";
import Demo from "@/page/demo";

const SignIn = lazy(() => import("../page/auth/SignIn"));
const Create = lazy(() => import("../page/dashboard/create"));
const Setting = lazy(() => import("../page/dashboard/setting"));
const WorkspaceSetting = lazy(
  () => import("../page/dashboard/workspace/setting")
);
const Member = lazy(() => import("../page/dashboard/member"));
const Home = lazy(() => import("../page/dashboard/home"));
const Dashboard = lazy(() => import("../page/dashboard"));
const WorkSpace = lazy(() => import("../page/dashboard/workspace"));
const Join = lazy(() => import("../page/dashboard/join/index"));
const Project = lazy(() => import("../page/dashboard/project"));
const ProjectSetting = lazy(() => import("../page/dashboard/project/setting"));
const Chat = lazy(() => import("../page/chat/Chat"));
const Storage = lazy(() => import("../page/storage"));
const Homes = lazy(() => import("../page/home"));
const Detail = lazy(() => import("../page/dashboard/detail"));
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
    path: "/",
    element: <Homes />,
  },
  {
    path: "/sign-in",
    element: (
      <Suspensed>
        <SignIn />
      </Suspensed>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspensed>
        <Dashboard />
      </Suspensed>
    ),
    children: [
      {
        path: "/dashboard/home",
        element: (
          <Suspensed>
            <Home />
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/create",
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
        path: "/dashboard/:workspaceId",
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Navigate to="home" replace />,
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/:workspaceId/home",
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
        path: "/dashboard/:workspaceId/setting",
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
        path: "/dashboard/:workspaceId/member",
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
        path: "/dashboard/:workspaceId/chat",
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Chat />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/:workspaceId/storage",
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Storage />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/:workspaceId/setting",
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
        path: "/dashboard/:workspaceId/:projectId",
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Navigate to="home" replace />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/:workspaceId/:projectId/home",
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
        path: "/dashboard/:workspaceId/:projectId/home/:taskId",
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Detail />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/:workspaceId/:projectId/demo",
        element: (
          <Suspensed>
            <Demo />
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/:workspaceId/:projectId/setting",
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
        path: "/dashboard/:workspaceId/:projectId/:taskId",
        element: (
          <Suspensed>
            <WorkContains>
              <Scroll>
                <Task />
              </Scroll>
            </WorkContains>
          </Suspensed>
        ),
      },
      {
        path: "/dashboard/join/:id",
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
    path: "*",
    element: <Index />,
  },
]);
