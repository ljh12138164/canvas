import MemberList from '@/components/board/MemberList';
import useUserAndWorkspace from '@/hooks/useUser';
import { observer } from 'mobx-react-lite';
// @ts-ignore
const Member = observer(() => {
  const { activeWorkspace, isLoading, user } = useUserAndWorkspace();
  if (isLoading) return <p>加载中</p>;
  if (!user) return <p>请先登录</p>;
  if (!activeWorkspace) return <p>请先选择工作区</p>;

  return <MemberList workspace={activeWorkspace} user={user} />;
});

export default Member;
