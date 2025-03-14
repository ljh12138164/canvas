import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { getSupabaseAuth } from '../../../libs/middle';
import {
  addJebtTaskRemark,
  createJebtTask,
  deleteJebtTask,
  getJebtTask,
  getJebtTaskDetail,
  moveJebtTask,
  updateJebtTask,
} from '../../../server/jebt/task';
import { TaskStatus } from '../../../types/jebt/board';
export const task = new Hono()
  // 创建任务
  .post(
    '/create',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        projectId: z.string(),
        workspaceId: z.string(),
        description: z.string().optional(),
        assigneeId: z.string(),
        status: z.nativeEnum(TaskStatus),
        lastTime: z.string(),
      }),
    ),
    async (c) => {
      const { name, projectId, workspaceId, description, assigneeId, status, lastTime } =
        c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        createJebtTask({
          name,
          projectId,
          workspaceId,
          currentUserId: auth.sub,
          token,
          description,
          assigneeId,
          status,
          lastTime,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 更新任务
  .patch(
    '/update',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        projectId: z.string(),
        workspaceId: z.string(),
        description: z.string().optional(),
        assigneeId: z.string(),
        status: z.nativeEnum(TaskStatus),
        lastTime: z.string(),
        id: z.string(),
      }),
    ),
    async (c) => {
      const { name, projectId, workspaceId, description, assigneeId, status, lastTime, id } =
        c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        updateJebtTask({
          currentUserId: auth.sub,
          name,
          projectId,
          workspaceId,
          description,
          assigneeId,
          status,
          lastTime,
          token,
          id,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 获取任务
  .get(
    '/get',
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        lastTime: z.string().nullish(),
        assigneeId: z.string().nullish(),
      }),
    ),
    async (c) => {
      const { workspaceId, projectId, status, search, lastTime, assigneeId } = c.req.valid('query');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        getJebtTask({
          currentUserId: auth.sub,
          workspaceId,
          projectId,
          status,
          search,
          lastTime,
          assigneeId,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 删除任务
  .delete(
    '/delete',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        workspaceId: z.string(),
        projectId: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId, projectId } = c.req.valid('json');
      const [error, data] = await to(
        deleteJebtTask({ id, currentUserId: auth.sub, workspaceId, projectId, token }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 根据id任务详情
  .get(
    '/detail',
    zValidator(
      'query',
      z.object({
        id: z.string(),
        workspaceId: z.string(),
        projectId: z.string(),
      }),
    ),
    async (c) => {
      const { id, workspaceId, projectId } = c.req.valid('query');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        getJebtTaskDetail({ id, workspaceId, projectId, currentUserId: auth.sub, token }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 添加评论
  .post(
    '/addRemark',
    zValidator(
      'json',
      z.object({
        taskId: z.string(),
        content: z.string(),
      }),
    ),
    async (c) => {
      const { taskId, content } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        addJebtTaskRemark({ taskId, content, currentUserId: auth.sub, token }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 移动
  .post(
    '/move',
    zValidator(
      'json',
      z.object({
        taskId: z.string(),
        workspaceId: z.string(),
        projectId: z.string(),
        position: z.number(),
        TaskStatus: z.nativeEnum(TaskStatus),
      }),
    ),
    async (c) => {
      const { taskId, workspaceId, projectId, position, TaskStatus } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        moveJebtTask({
          taskId,
          currentUserId: auth.sub,
          workspaceId,
          token,
          projectId,
          position,
          TaskStatus,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );

export default task;
