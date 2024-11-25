import DrawerFromCard from '@/components/board/DrawerFromCard';
import styled from 'styled-components';
import { useProjectList } from '@/server/hooks/project';
import { ScrollArea } from '../ui/scrollArea';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemoizedFn } from 'ahooks';
import { observer } from 'mobx-react-lite';
import useStore from '@/store/user';
import { useEffect } from 'react';

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
  height: calc(50dvh - 150px);
`;
const ProjectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: white;
  }
`;
const ProjecttList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
  gap: 5px;
`;
const ProjectList = observer(
  ({ workspaceId, userId }: { workspaceId: string; userId: string }) => {
    const { projectId } = useParams();
    const store = useStore;
    const navigate = useNavigate();
    const { projectList, isLoadingProjectList, projectListError } =
      useProjectList(workspaceId, userId);
    const checkActive = useMemoizedFn((id: string) => {
      return projectId === id;
    });
    useEffect(() => {
      if (isLoadingProjectList) return;
      if (projectList) {
        store.setProject(projectList);
        store.setActiveProject(
          projectList.find((project) => project.id === projectId) || null
        );
      }
    }, [projectList, projectId, store, isLoadingProjectList]);
    return (
      <>
        <TitleContain>
          <TitleP>项目</TitleP>
          <DrawerFromCard type='project'></DrawerFromCard>
        </TitleContain>
        <ListContain>
          {isLoadingProjectList && <div>加载中...</div>}
          {projectListError && <div>加载失败</div>}
          {projectList && (
            <ProjecttList>
              {projectList.map((project) => (
                <ProjectItem
                  onClick={() => {
                    if (!checkActive(project.id)) {
                      navigate(`/dashboard/${workspaceId}/${project.id}`);
                    }
                  }}
                  key={project.id}
                  className={checkActive(project.id) ? 'active bg-white' : ''}
                >
                  <img
                    className='rounded-sm'
                    src={project.imageUrl}
                    alt='项目图片'
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
  }
);
export default ProjectList;
