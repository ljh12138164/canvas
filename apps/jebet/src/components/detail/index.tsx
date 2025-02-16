import { useCreateTaskRemark, useGetTaskDetail } from '@/server/hooks/tasks';
import { DEFAULT_AVATAR } from '@/server/supabase/user';
import type { Profiles } from '@/types/user';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  LuArrowLeft,
  LuCalendar,
  LuFlag,
  LuLayoutList,
  LuMessageSquare,
  LuSend,
} from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scrollArea';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const DetailContainer = styled(motion.div)`
  flex: 1;
  padding: 24px;
  z-index: 0;
  max-height: 100%;
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: hsl(var(--foreground));
`;

const Description = styled.p`
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  line-height: 1.6;
  margin: 1rem 0;
  white-space: pre-wrap;
`;

const ContentArea = styled(ScrollArea)`
  height: calc(100vh - 180px);
  padding: 1rem 0;
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: hsl(var(--secondary));
  border-radius: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const MetaContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MetaLabel = styled.span`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaValue = styled.span`
  font-size: 1rem;
  color: hsl(var(--foreground));
  font-weight: 500;
`;

const TabContainer = styled(Tabs)`
  margin-top: 2rem;
`;

const StyledTabsList = styled(TabsList)`
  background: hsl(var(--secondary));
  padding: 4px;
`;

const StyledTabsTrigger = styled(TabsTrigger)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;

  &[data-state='active'] {
    background: hsl(var(--background));
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:hover:not([data-state='active']) {
    background: hsl(var(--accent));
    transform: translateY(-1px);
  }
`;

const TabContentContainer = styled(TabsContent)`
  padding: 1.5rem;
  background: hsl(var(--secondary));
  border-radius: 8px;
  margin-top: 1rem;
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentInput = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: hsl(var(--background));
  border-radius: 8px;
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentAuthor = styled.span`
  font-weight: 500;
  color: hsl(var(--foreground));
`;

const CommentTime = styled.span`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const CommentText = styled.p`
  color: hsl(var(--foreground));
  white-space: pre-wrap;
  margin: 0;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SkeletonMetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: hsl(var(--secondary));
  border-radius: 8px;
`;

const SkeletonMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Detail = ({
  workspaceId,
  projectId,
  userData,
}: {
  workspaceId: string;
  projectId: string;
  userData: Profiles;
}) => {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  const { createTaskRemark, createTaskRemarkLoading } = useCreateTaskRemark();
  const navigate = useNavigate();
  const params = useParams();
  const { data: taskDetail, isLoading } = useGetTaskDetail(workspaceId, projectId, params.taskId!);

  // 模拟数据

  const handleComment = () => {
    if (!comment.trim()) return;
    // 提交评论
    createTaskRemark(
      {
        json: {
          taskId: params.taskId!,
          content: comment,
        },
      },
      {
        onSuccess: () => {
          toast.success('评论成功');
          queryClient.invalidateQueries({
            queryKey: ['taskDetail', workspaceId, projectId, params.taskId!],
          });
          setComment('');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <DetailContainer>
        <SkeletonContainer>
          <SkeletonHeader>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-[200px]" />
          </SkeletonHeader>

          <Separator className="my-4" />

          <SkeletonMetaInfo>
            <SkeletonMetaItem>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </SkeletonMetaItem>
            <SkeletonMetaItem>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </SkeletonMetaItem>
            <SkeletonMetaItem>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </SkeletonMetaItem>
          </SkeletonMetaInfo>

          <Skeleton className="h-32 w-full" />

          <div className="space-y-3">
            <Skeleton className="h-10 w-[120px]" />
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-20 flex-1" />
              </div>
              {Array.from({ length: 3 }).map((_) => (
                <div key={nanoid()} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonContainer>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <Header>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <LuArrowLeft size={20} />
        </Button>
        <Title>{taskDetail?.name}</Title>
      </Header>

      <Separator className="my-4" />

      <ContentArea>
        <MetaInfo>
          <MetaItem>
            <LuCalendar size={20} />
            <MetaContent>
              <MetaLabel>创建时间</MetaLabel>
              <MetaValue>
                {taskDetail?.created_at
                  ? dayjs(taskDetail.created_at).format('YYYY-MM-DD HH:mm')
                  : '未知'}
              </MetaValue>
            </MetaContent>
          </MetaItem>
          <MetaItem>
            <LuLayoutList size={20} />
            <MetaContent>
              <MetaLabel>状态</MetaLabel>
              <Badge>{taskDetail?.status || '未设置'}</Badge>
            </MetaContent>
          </MetaItem>
          <MetaItem>
            <LuFlag size={20} />
            <MetaContent>
              <MetaLabel>优先级</MetaLabel>
              <Badge>{taskDetail?.priority || '未设置'}</Badge>
            </MetaContent>
          </MetaItem>
        </MetaInfo>

        <Description>{taskDetail?.description}</Description>

        <TabContainer defaultValue="comments">
          <StyledTabsList>
            <StyledTabsTrigger value="comments">
              <LuMessageSquare size={16} />
              评论
            </StyledTabsTrigger>
          </StyledTabsList>

          <TabContentContainer value="comments">
            <CommentSection>
              <CommentInput>
                <Avatar>
                  <AvatarImage src={userData.image || DEFAULT_AVATAR} alt="用户头像" />
                  <AvatarFallback>{userData.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="写下你的评论..."
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleComment}
                    disabled={!comment.trim() || createTaskRemarkLoading}
                  >
                    <LuSend size={16} />
                  </Button>
                </div>
              </CommentInput>

              <AnimatePresence>
                <CommentList>
                  {taskDetail?.remark.map((remark) => (
                    <CommentItem
                      key={remark.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <CommentContent>
                        <CommentHeader>
                          <CommentAuthor />
                          <CommentTime>
                            {dayjs(remark.created_at).format('YYYY-MM-DD HH:mm')}
                          </CommentTime>
                        </CommentHeader>
                        <CommentText>{remark.content}</CommentText>
                      </CommentContent>
                    </CommentItem>
                  ))}
                </CommentList>
              </AnimatePresence>
            </CommentSection>
          </TabContentContainer>
        </TabContainer>
      </ContentArea>
    </DetailContainer>
  );
};

export default Detail;
