import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
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

const task = new Hono()
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
        currentUserId: z.string(),
      }),
    ),
    async (c) => {
      const {
        name,
        projectId,
        workspaceId,
        description,
        assigneeId,
        status,
        lastTime,
        currentUserId,
      } = c.req.valid('json');
      const [error, data] = await to(
        createJebtTask({
          currentUserId,
          name,
          projectId,
          workspaceId,
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
        currentUserId: z.string(),
        id: z.string(),
      }),
    ),
    async (c) => {
      const {
        name,
        projectId,
        workspaceId,
        description,
        assigneeId,
        status,
        lastTime,
        currentUserId,
        id,
      } = c.req.valid('json');
      const [error, data] = await to(
        updateJebtTask({
          currentUserId,
          name,
          projectId,
          workspaceId,
          description,
          assigneeId,
          status,
          lastTime,
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
        currentUserId: z.string(),
        projectId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        lastTime: z.string().nullish(),
        assigneeId: z.string().nullish(),
      }),
    ),
    async (c) => {
      const { workspaceId, projectId, currentUserId, status, search, lastTime, assigneeId } =
        c.req.valid('query');
      const [error, data] = await to(
        getJebtTask({
          currentUserId,
          workspaceId,
          projectId,
          status,
          search,
          lastTime,
          assigneeId,
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
        currentUserId: z.string(),
        workspaceId: z.string(),
        projectId: z.string(),
      }),
    ),
    async (c) => {
      const { id, currentUserId, workspaceId, projectId } = c.req.valid('json');
      const [error, data] = await to(deleteJebtTask({ id, currentUserId, workspaceId, projectId }));
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
        currentUserId: z.string(),
      }),
    ),
    async (c) => {
      const { id, workspaceId, projectId, currentUserId } = c.req.valid('query');
      const [error, data] = await to(
        getJebtTaskDetail({ id, workspaceId, projectId, currentUserId }),
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
        currentUserId: z.string(),
      }),
    ),
    async (c) => {
      const { taskId, content, currentUserId } = c.req.valid('json');
      const [error, data] = await to(addJebtTaskRemark({ taskId, content, currentUserId }));
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
        currentUserId: z.string(),
        workspaceId: z.string(),
        projectId: z.string(),
        position: z.number(),
        TaskStatus: z.nativeEnum(TaskStatus),
      }),
    ),
    async (c) => {
      const { taskId, currentUserId, workspaceId, projectId, position, TaskStatus } =
        c.req.valid('json');
      const [error, data] = await to(
        moveJebtTask({
          taskId,
          currentUserId,
          workspaceId,
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
