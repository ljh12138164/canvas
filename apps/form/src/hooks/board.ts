import { useMutation, useQuery } from '@tanstack/vue-query'
import { client } from '@/database'
import type { InferRequestType, InferResponseType } from 'hono/client'
import { getNewToken } from '@/lib/sign'
/**
 * @description 获取表单
 * @returns 表单
 */
export const useGetrBoard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['board'],
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
type CreateBoardResponse = InferResponseType<typeof client.board.form.$post, 200>
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
      const json = await data.json()
      return json
    },
  })
}
type GetBoardResponse = InferResponseType<(typeof client.board.form)[':id']['$get'], 200>
/**
 * @description 获取表单详情
 * @param id 表单id
 * @returns 表单详情
 */
export const useBoard = (id: string) => {
  return useQuery<GetBoardResponse, Error>({
    queryKey: ['board', id],
    queryFn: async () => {
      const token = await getNewToken()
      const data = await client.board.form[':id'].$get(
        { param: { id } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!data.ok) throw new Error(data.statusText)
      const json = await data.json()
      return json
    },
  })
}

type UpdateBoard = InferRequestType<(typeof client.board.form)['$patch']>
type UpdateBoardResponse = InferResponseType<(typeof client.board.form)['$patch'], 200>
/**
 * @description 更新表单
 * @returns 更新结果
 */
export const useUpdateBoard = () => {
  return useMutation<UpdateBoardResponse, Error, UpdateBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken()
      const data = await client.board.form.$patch(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!data.ok) throw new Error(data.statusText)
      const json = await data.json()
      return json
    },
  })
}

type DeleteBoard = InferRequestType<typeof client.board.form.$delete>
type DeleteBoardResponse = InferResponseType<typeof client.board.form.$delete, 200>
/**
 * ### 删除表单
 * @param id 表单id
 * @returns 删除结果
 **/
export const useDeleteBoard = () => {
  return useMutation<DeleteBoardResponse, Error, DeleteBoard>({
    mutationFn: async (datas) => {
      const token = await getNewToken()
      const data = await client.board.form.$delete(datas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!data.ok) throw new Error(data.statusText)
      const json = await data.json()
      return json
    },
  })
}
