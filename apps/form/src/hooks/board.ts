import { useMutation, useQuery } from '@tanstack/vue-query'
import { client } from '@/server'
import type { InferRequestType, InferResponseType } from 'hono/client'
/**
 * @description 获取表单
 * @returns 表单
 */
export const useGetrBoard = (token: string, userId: string) => {
  return useQuery({
    queryKey: ['board', userId],
    queryFn: async () => {
      const data = await client.board.form.$get(undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!data.ok) throw new Error(data.statusText)
      return data.json()
    },
  })
}

type CreateBoard = InferRequestType<typeof client.board.form.$post>
type CreateBoardResponse = InferResponseType<typeof client.board.form.$post>
/**
 * ## 创建表单
 */
export const useCreateBoard = (token: string) => {
  return useMutation<CreateBoardResponse, Error, CreateBoard>({
    mutationFn: async (datas) => {
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
