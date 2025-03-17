import DrawerFromCard from '@/components/board/DrawerFromCard';
import Logo from '@/components/command/Logo';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useWorkspace } from '@/server/hooks/board';
import userStore from '@/store/user';
import type { Profiles } from '@/types/user';
import type { Workspace } from '@/types/workspace';
import { useMemoizedFn } from 'ahooks';
import { File } from 'lucide-react';
import { observer } from 'mobx-react-lite';
// import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { LuMessageSquare, LuSettings, LuUser } from 'react-icons/lu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import UserBox from '../command/UserBox';
import ProjectList from './ProjectList';

type PathRush = 'home' | 'member' | 'setting' | 'chat' | 'storage' | 'flow';
const Asider = styled.aside`
  flex-basis: 250px;
  width: 100%;
  height: 100%;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;
const RouterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const RouterDiv = styled(Button)`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  border-radius: var(--radius);
  padding: 1px;
  transition: all 0.2s;
`;

const UserButtonContainer = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  border: 1px solid hsl(var(--border));
  gap: 20px;
`;
const UserDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const EmailText = styled.p`
  font-size: 0.8rem;
  color: hsl(var(--muted-foreground));
`;
const NameText = styled.p`
  font-size: 0.8rem;
`;
const ButtonContainer = styled.p`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0 1rem;
  gap: 10px;
`;
const Title = styled.h1`
  font-size: 1rem;
  opacity: 0.5;
  margin: 0;
`;
const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  height: 4rem;
  border: 2px solid hsl(var(--border));
  border-radius: var(--radius);
`;

const LoadingP = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const SelectItems = styled(SelectItem)`
  display: flex;
  transition: all 0.2s;
  padding-left: 1rem;
  &:hover {
    background-color: #e5e7eba0;
  }
`;
export const SelectImage = styled.img`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 4px;
`;
const TitleP = styled.p`
  font-size: 1rem;
  opacity: 0.5;
  margin: 0;
`;
const TitleContain = styled.section`
  display: flex;
  justify-content: space-between;
`;

const SiderBar = observer(({ user }: { user: Profiles }) => {
  const router = useLocation();
  const navigate = useNavigate();
  const parmas = useParams();
  const { isLoading, data, error, isFetching } = useWorkspace(user.id);
  // useEffect(() => {
  //   if (isLoading || error) return;
  //   if (data) {
  //     userStore.setWorkspace(data);
  //   }
  // }, [data, isLoading, error]);

  // 判断是否是当前路径
  const checkActive = (path: PathRush) => {
    const workspaceId = parmas?.workspaceId;
    if (!workspaceId) return router.pathname === `/dashboard/${path}`;
    return router.pathname === `/dashboard/${workspaceId}/${path}`;
  };
  const handleJump = useMemoizedFn((path: PathRush) => {
    if (isLoading) return;
    const workspaceId = parmas?.workspaceId;
    if (!workspaceId) {
      toast.dismiss();
      if (path !== 'home') toast.error('请选择工作区');
      return;
    }
    navigate(`/dashboard/${workspaceId}/${path}`);
  });
  return (
    <Asider>
      {/* 菜单 */}
      <RouterContainer>
        <div>
          <Logo />
        </div>
        <TitleContain>
          <TitleP>工作区</TitleP>
          <DrawerFromCard type="workspace" />
        </TitleContain>
        <SelectContainer>
          {isLoading && !error && <LoadingP>加载中</LoadingP>}
          {!isLoading && !error && (
            <Select
              onValueChange={(value) => {
                navigate(`/dashboard/${value}`);
              }}
              value={
                !isFetching && userStore.workspace && !isLoading
                  ? userStore.workspace?.find((item) => item.id === parmas?.workspaceId)?.id
                  : undefined
              }
            >
              <SelectTrigger className="w-full h-full  dark:hover:bg-slate-900 hover:bg-slate-100 transition-all duration-200">
                <SelectValue placeholder="选择工作区" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Array.isArray(data) &&
                    data?.map((item: Workspace) => (
                      <SelectItems key={item.id} value={item.id}>
                        <div className="flex items-center justify-start gap-2 ">
                          <SelectImage src={item.imageUrl} alt={item.name} />
                          <p>{item.name}</p>
                        </div>
                      </SelectItems>
                    ))}
                  {data?.length === 0 && !isLoading && <p>无数据，请创建</p>}
                  {isLoading && <p>加载中</p>}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {error && <div>获取失败</div>}
        </SelectContainer>
        <Title>菜单</Title>
        <RouterDiv
          variant="ghost"
          className={`cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 ${checkActive('home') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          asChild
          onClick={() => {
            handleJump('home');
          }}
        >
          <ButtonContainer>
            <TfiMenuAlt />
            <span>主页</span>
          </ButtonContainer>
        </RouterDiv>
        <RouterDiv
          onClick={() => {
            handleJump('member');
          }}
          variant="ghost"
          className={`cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 ${checkActive('member') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          asChild
        >
          <ButtonContainer>
            <LuUser />
            <span>成员</span>
          </ButtonContainer>
        </RouterDiv>

        <RouterDiv
          onClick={() => {
            handleJump('setting');
          }}
          variant="ghost"
          className={`cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 ${checkActive('setting') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          asChild
        >
          <ButtonContainer>
            <LuSettings />
            <span>设置</span>
          </ButtonContainer>
        </RouterDiv>

        <RouterDiv
          onClick={() => handleJump('chat')}
          variant="ghost"
          className={`cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 ${checkActive('chat') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          asChild
        >
          <ButtonContainer>
            <LuMessageSquare />
            <span>聊天</span>
          </ButtonContainer>
        </RouterDiv>
        <RouterDiv
          onClick={() => handleJump('storage')}
          variant="ghost"
          className={`cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 ${checkActive('storage') ? 'bg-zinc-200 dark:bg-zinc-700' : ''}`}
          asChild
        >
          <ButtonContainer>
            <File />
            <span>团队空间</span>
          </ButtonContainer>
        </RouterDiv>

        <Separator />

        {parmas?.workspaceId && userStore.workspace && (
          <ProjectList workspaceId={parmas?.workspaceId} />
        )}
      </RouterContainer>
      {/* 用户信息 */}
      <UserButtonContainer>
        <UserBox user={user} />
        <UserDataContainer>
          <NameText>{user.name}</NameText>
          <EmailText>{user.email}</EmailText>
        </UserDataContainer>
      </UserButtonContainer>
    </Asider>
  );
});

export default SiderBar;
