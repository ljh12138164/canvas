import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import {
  createJebtProject,
  deleteJebtProject,
  getJebtProjectList,
  updateJebtProject,
} from '../../../server/jebt/project';

const project = new Hono()
  // 获取项目列表
  .get(
    '/list',
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
      })
    ),
    async (c) => {
      const { workspaceId, userId } = c.req.valid('query');
      const [error, data] = await to(
        getJebtProjectList({
          workspaceId: workspaceId,
          userId,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  )
  // 创建项目
  .post(
    '/create',
    zValidator(
      'form',
      z.object({
        name: z.string(),
        file: z.any(),
        userId: z.string(),
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { name, file, userId, workspaceId } = body;
      const [error, data] = await to(
        createJebtProject({
          name: name as string,
          imageUrl: file as File | string,
          userId: userId as string,
          workspaceId: workspaceId as string,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  )
  // 更新项目
  .patch(
    '/update',
    zValidator(
      'form',
      z.object({
        name: z.string(),
        file: z.any(),
        userId: z.string(),
        workspaceId: z.string(),
        projectId: z.string(),
        oldImageUrl: z.string(),
      })
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { name, file, userId, workspaceId, projectId, oldImageUrl } = body;
      const [error, data] = await to(
        updateJebtProject({
          name: name as string,
          projectId: projectId as string,
          imageUrl: file as File | string,
          userId: userId as string,
          workspaceId: workspaceId as string,
          oldImageUrl: oldImageUrl as string,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  )
  // 删除项目
  .delete(
    '/delete',
    zValidator(
      'json',
      z.object({
        userId: z.string(),
        workspaceId: z.string(),
        projectId: z.string(),
        imageUrl: z.string(),
      })
    ),
    async (c) => {
      const { userId, workspaceId, projectId, imageUrl } = c.req.valid('json');
      const [error, data] = await to(
        deleteJebtProject({
          userId,
          workspaceId,
          projectId,
          imageUrl,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  );

export default project;
