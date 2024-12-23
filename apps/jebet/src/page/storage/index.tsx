import CreateStorage from '@/components/storage/Create';
import TableMain from '@/components/storage/TableMain';
import { ScrollArea } from '@/components/ui/scrollArea';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import useStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const StoageContainer = styled.main<{ mobile: boolean }>`
  width: 100%;
  height: 100%;
  max-width: ${(props) =>
    props.mobile ? 'calc(100dvw - 50px)' : 'calc(100dvw - 300px)'};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const StoageTitle = styled.h2`
  flex: 1;
  height: 50px;
  display: flex;
`;
const WorkpaceName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
`;
const Storage = observer(() => {
  const isModel = useIsMobile();
  const store = useStore;
  const params = useParams();
  if (store.userData === null || store.workspace === null) return <></>;
  const activeWorkSpace = store.workspace.find(
    (item) => item.id === params.workspaceId
  );
  if (!store.userData) {
    toast({
      title: '请先登录',
      description: '请稍后再试',
      variant: 'destructive',
    });
    return <Navigate to='/sign-in' replace />;
  }
  if (!activeWorkSpace) {
    toast({
      title: '未找到工作区',
      description: '请稍后再试',
      variant: 'destructive',
    });
    return <Navigate to='/dashboard' replace />;
  }
  if (!params.workspaceId) {
    toast({
      title: '未选择工作区',
      description: '请稍后再试',
      variant: 'destructive',
    });
    return <Navigate to='/dashboard' replace />;
  }
  return (
    <StoageContainer mobile={isModel}>
      <ScrollArea className='w-full h-full'>
        <StoageTitle>
          <div>
            <WorkpaceName>工作区{activeWorkSpace.name}</WorkpaceName>
            <span className='text-sm text-gray-500'>团队空间</span>
          </div>
          <section className='ml-auto'>
            <CreateStorage
              userId={store.userData.id}
              workspace={activeWorkSpace}
            />
          </section>
        </StoageTitle>
        <Separator className='my-2' />
        <TableMain workspace={activeWorkSpace} userId={store.userData.id} />
      </ScrollArea>
    </StoageContainer>
  );
});

export default Storage;
