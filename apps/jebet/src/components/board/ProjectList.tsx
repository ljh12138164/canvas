import DrawerFromCard from '@/components/board/DrawerFromCard';
import { useProjectList } from '@/server/hooks/project';
import useStore from '@/store/user';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ScrollArea } from '../ui/scrollArea';
import { Skeleton } from '../ui/skeleton';

const TitleP = styled.p`
  font-size: 1rem;
  opacity: 0.5;
  margin: 0;
`;
const TitleContain = styled.section`
  display: flex;
  justify-content: space-between;
`;
const ListContain = styled(ScrollArea)`
  height: calc(50dvh - 250px);
`;
const ProjectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
`;
const ProjecttList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
  gap: 5px;
`;

const SkeletonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
`;

const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
  gap: 10px;
`;

const ProjectList = observer(({ workspaceId }: { workspaceId: string }) => {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const store = useStore;
  const navigate = useNavigate();
  const { projectList, isLoadingProjectList, projectListError } = useProjectList(workspaceId);
  const checkActive = useMemoizedFn((id: string) => {
    return projectId === id;
  });
  useEffect(() => {
    if (isLoadingProjectList) return;
    if (projectList) {
      store.setProject(projectList);
      store.setActiveProject(projectList.find((project) => project.id === projectId) || null);
    }
  }, [projectList, projectId, store, isLoadingProjectList]);
  return (
    <>
      <TitleContain>
        <TitleP>项目</TitleP>
        <DrawerFromCard type="project" />
      </TitleContain>
      <ListContain>
        {isLoadingProjectList && (
          <SkeletonList>
            {Array.from({ length: 5 }).map((_) => (
              <SkeletonItem key={nanoid()}>
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-4 w-[100px]" />
              </SkeletonItem>
            ))}
          </SkeletonList>
        )}
        {projectListError && <div>加载失败</div>}
        {projectList && (
          <ProjecttList>
            {projectList.map((project) => (
              <ProjectItem
                onClick={() => {
                  if (!checkActive(project.id)) {
                    queryClient.invalidateQueries({
                      queryKey: ['projectList', workspaceId],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ['taskList', workspaceId, projectId],
                    });
                    navigate(`/dashboard/${workspaceId}/${project.id}`);
                  }
                }}
                key={project.id}
                className={
                  checkActive(project.id)
                    ? 'active bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }
              >
                <img
                  className="rounded-sm"
                  src={project.imageUrl}
                  alt="项目图片"
                  width={20}
                  height={20}
                />
                <div>{project.name}</div>
              </ProjectItem>
            ))}
          </ProjecttList>
        )}
      </ListContain>
    </>
  );
});
export default ProjectList;
