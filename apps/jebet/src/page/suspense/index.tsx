import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
`;

const SidebarSkeleton = styled.div`
  width: 250px;
  height: 100%;
  border-right: 1px solid hsl(var(--border));
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainContentSkeleton = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WorkspaceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProjectSection = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChildLoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: hsl(var(--background));
`;

const Loading = () => (
  <LoadingContainer>
    <SidebarSkeleton>
      {/* Logo */}
      <Skeleton className="h-8 w-8 rounded-md" />

      {/* 工作区 */}
      <WorkspaceSection>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </WorkspaceSection>

      {/* 项目列表 */}
      <ProjectSection>
        <Skeleton className="h-4 w-16" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-full rounded-sm" />
        ))}
      </ProjectSection>

      {/* 底部用户信息 */}
      <div className="mt-auto flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </SidebarSkeleton>

    <MainContentSkeleton>
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-lg" />
        ))}
      </div>
    </MainContentSkeleton>
  </LoadingContainer>
);

const ChildLoading = () => (
  <ChildLoadingContainer>
    {/* 顶部操作栏 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>

    {/* 内容区域 */}
    <div className="flex-1 space-y-4">
      {/* 搜索和过滤区 */}
      <div className="flex gap-4">
        <Skeleton className="h-9 w-[200px] rounded-md" />
        <Skeleton className="h-9 w-[150px] rounded-md" />
        <Skeleton className="h-9 w-[150px] rounded-md" />
      </div>

      {/* 主要内容表格 */}
      <div className="space-y-2">
        <div className="flex items-center gap-4 p-2">
          <Skeleton className="h-4 w-[30%]" />
          <Skeleton className="h-4 w-[20%]" />
          <Skeleton className="h-4 w-[20%]" />
          <Skeleton className="h-4 w-[30%]" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-2">
            <Skeleton className="h-4 w-[30%]" />
            <Skeleton className="h-4 w-[20%]" />
            <Skeleton className="h-4 w-[20%]" />
            <Skeleton className="h-4 w-[30%]" />
          </div>
        ))}
      </div>
    </div>
  </ChildLoadingContainer>
);

/**
 * ### 布局的suspense
 */
function Suspensed({ children, type }: { children: React.ReactNode; type?: 'sign' }) {
  return <Suspense fallback={type === 'sign' ? <></> : <Loading />}>{children}</Suspense>;
}

/**
 * ### 子组件的suspense
 */
function SuspensedChild({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ChildLoading />}>{children}</Suspense>;
}

export { Loading, Suspensed, SuspensedChild };
