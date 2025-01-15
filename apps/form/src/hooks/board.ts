import { useMutation, useQuery } from '@tanstack/vue-query'
import { client } from '@/database'
import type { InferRequestType, InferResponseType } from 'hono/client'
import { getNewToken } from '@/lib/sign'
/**
 * @description 获取表单
 * @returns 表单
 */
export const useGetrBoard = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['board', userId],
    queryFn: async () => {
      const token = await getNewToken()
      const data = await client.board.form.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!data.ok) throw new Error(data.statusText)
      return data.json()
    },
  })
  return { data, isLoading, error }
}

type CreateBoard = InferRequestType<typeof client.board.form.$post>
type CreateBoardResponse = InferResponseType<typeof client.board.form.$post>
/**
 * ## 创建表单
 */
export const useCreateBoard = () => {
  return useMutation<CreateBoardResponse, Error, CreateBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken()
      const data = await client.board.form.$post(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!data.ok) throw new Error(data.statusText)
      return data.json()
    },
  })
}
