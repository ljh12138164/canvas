import styled from 'styled-components';
import { ScrollArea } from '../ui/scrollArea';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FiPlus } from 'react-icons/fi';
import { Separator } from '../ui/separator';
const ProjectContentContainer = styled(Card)`
  flex: 1;
  padding: 10px;
`;
const ProjectNavItem = styled(Button)<{ isActive: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${({ isActive }) =>
    isActive ? '#faf9f9750' : '#e5e7eb68'};
  &:hover {
    background-color: ${({ isActive }) =>
      isActive ? '#faf9f9750' : '#e5e7eb68'};
  }
`;
const ProjectNavContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ProjectNavList = styled.div`
  display: flex;
  background-color: '#e5e7eba0';
  gap: 10px;
`;
const ProjectNav = styled.nav`
  height: 6dvh;
`;
const ProjectScrollArea = styled(ScrollArea)`
  height: 60dvh;
`;
const PlusButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;
type SelectTap = 'kanban' | 'task' | 'calendar';
const SelectTaps = {
  task: '工作区',
  calendar: '日历',
  kanban: '看板',
};
const ProjectContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectTap, setSelectTap] = useState<SelectTap>(() => {
    const select = searchParams.get('select');
    if (select && Object.keys(SelectTaps).includes(select))
      return select as SelectTap;
    return 'task';
  });
  useEffect(() => {
    const select = searchParams.get('select');
    if (!select || !Object.keys(SelectTaps).includes(select)) {
      searchParams.set('select', 'task');
      setSearchParams(searchParams);
      setSelectTap('task');
    }
  }, [selectTap]);
  return (
    <ProjectContentContainer>
      <ProjectNav>
        <ProjectNavContainer>
          <ProjectNavList>
            {Object.keys(SelectTaps).map((key) => (
              <ProjectNavItem
                variant='muted'
                isActive={selectTap === key}
                key={key}
                onClick={() => {
                  searchParams.set('select', key);
                  setSearchParams(searchParams);
                  setSelectTap(key as SelectTap);
                }}
              >
                {SelectTaps[key as SelectTap]}
              </ProjectNavItem>
            ))}
          </ProjectNavList>
          <PlusButton>
            <FiPlus />
            <span>添加</span>
          </PlusButton>
        </ProjectNavContainer>
        <Separator className='my-2' />
      </ProjectNav>
      <ProjectScrollArea>
        {/* TODO: 根据不同的selectTap显示不同的内容 */}
      </ProjectScrollArea>
    </ProjectContentContainer>
  );
};
export default ProjectContent;
