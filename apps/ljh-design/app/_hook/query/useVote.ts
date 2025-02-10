import { client } from '@/app/_database';
import { getNewToken } from '@/app/_lib/sign';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

type VoteResponseType = InferResponseType<(typeof client.upvote.upvote)['$post']>;
type VoteRequestType = InferRequestType<(typeof client.upvote.upvote)['$post']>;

/**
 * ### 点赞
 * @returns
 */
export const useVote = () => {
  const router = useRouter();
  const { mutate: vote, isPending: votePending } = useMutation<
    VoteResponseType,
    Error,
    VoteRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const response = await client.upvote.upvote.$post(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { vote, votePending };
};

type CancelVoteResponseType = InferResponseType<(typeof client.upvote.cancel)['$delete']>;
type CancelVoteRequestType = InferRequestType<(typeof client.upvote.cancel)['$delete']>;

/**
 * ### 取消点赞
 * @returns
 */
export const useCancelVote = () => {
  const router = useRouter();
  const { mutate: cancelVote, isPending: cancelVotePending } = useMutation<
    CancelVoteResponseType,
    Error,
    CancelVoteRequestType
  >({
    mutationFn: async (data) => {
      const token = await getNewToken();
      if (!token) {
        router.push('/sign-in');
        throw new Error('请先登录');
      }
      const response = await client.upvote.cancel.$delete(data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
      }
      return response.json();
    },
  });
  return { cancelVote, cancelVotePending };
};
