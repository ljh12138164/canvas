import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { getSupabaseAuth } from '../../../libs/middle';
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
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { workspaceId } = c.req.valid('query');
      const [error, data] = await to(
        getJebtProjectList({
          workspaceId: workspaceId,
          userId: auth.sub,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 创建项目
  .post(
    '/create',
    zValidator(
      'form',
      z.object({
        name: z.string(),
        file: z.any(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { name, file, workspaceId } = body;
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        createJebtProject({
          name: name as string,
          imageUrl: file as File | string,
          userId: auth.sub,
          workspaceId: workspaceId as string,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 更新项目
  .patch(
    '/update',
    zValidator(
      'form',
      z.object({
        name: z.string(),
        file: z.any(),
        workspaceId: z.string(),
        projectId: z.string(),
        oldImageUrl: z.string(),
      }),
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { name, file, workspaceId, projectId, oldImageUrl } = body;
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        updateJebtProject({
          name: name as string,
          projectId: projectId as string,
          imageUrl: file as File | string,
          userId: auth.sub,
          workspaceId: workspaceId as string,
          oldImageUrl: oldImageUrl as string,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 删除项目
  .delete(
    '/delete',
    zValidator(
      'json',
      z.object({
        workspaceId: z.string(),
        projectId: z.string(),
        imageUrl: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { workspaceId, projectId, imageUrl } = c.req.valid('json');
      const [error, data] = await to(
        deleteJebtProject({
          userId: auth.sub,
          workspaceId,
          projectId,
          imageUrl,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );

export default project;
