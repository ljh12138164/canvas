import { useCancelCollection, useCollection } from '@/app/_hook/query/useColleciont';
import { type GetShowResponseType, useGetShow, useShow } from '@/app/_hook/query/useShow';
import { useCancelVote, useVote } from '@/app/_hook/query/useVote';
import { useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, HeartIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

// 帖子的选项
export function ShowOption({ showData, id }: { showData: GetShowResponseType; id: string }) {
  const queryClient = useQueryClient();
  const { showFetching } = useGetShow(id);
  const { vote, votePending } = useVote();
  const { cancelVote, cancelVotePending } = useCancelVote();
  const { cancelCollection, cancelCollectionPending } = useCancelCollection();
  const { collectionMutate, collectionLoading } = useCollection();

  function handleVote() {
    if (showData.isUpvote)
      return cancelVote(
        { json: { showId: showData.id } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['show', showData.id] });
            toast.success('取消点赞成功');
          },
        },
      );
    vote(
      { json: { showId: showData.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['show', showData.id] });
          toast.success('点赞成功');
        },
      },
    );
  }
  function handleCollection() {
    if (showData.isCollect)
      return cancelCollection(
        { json: { showId: showData.id } },
        {
          onSuccess: () => {
            toast.success('取消收藏成功');
            queryClient.invalidateQueries({ queryKey: ['show', showData.id] });
            queryClient.invalidateQueries({ queryKey: ['like', ''] });
            queryClient.invalidateQueries({ queryKey: ['collection', ''] });
          },
        },
      );
    collectionMutate(
      { json: { showId: showData.id } },
      {
        onSuccess: () => {
          toast.success('收藏成功');
          queryClient.invalidateQueries({ queryKey: ['show', showData.id] });
          queryClient.invalidateQueries({ queryKey: ['like', ''] });
          queryClient.invalidateQueries({ queryKey: ['collection', ''] });
        },
      },
    );
  }
  return (
    <section className="flex  gap-4 ">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleVote}
          disabled={cancelVotePending || votePending || showFetching}
        >
          <HeartIcon className={`w-4 h-4 ${showData.isUpvote ? 'text-red-500' : ''}`} />
          {showData.isUpvote ? '已点赞' : '点赞'}
        </Button>
        <Button
          variant="outline"
          onClick={handleCollection}
          disabled={cancelCollectionPending || collectionLoading || showFetching}
        >
          <BookmarkIcon className={`w-4 h-4 ${showData.isCollect ? 'text-blue-500' : ''}`} />
          {showData.isCollect ? '已收藏' : '收藏'}
        </Button>
      </div>
    </section>
  );
}
