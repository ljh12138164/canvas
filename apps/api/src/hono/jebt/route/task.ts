import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { TaskStatus } from "../../../types/jebt/board";
import { z } from "zod";
import { errorCheck } from "../../../libs/error";
import to from "await-to-js";
import { createJebtTask, getJebtTask } from "../../../server/jebt/task";

const task = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        projectId: z.string(),
        workspaceId: z.string(),
        description: z.string().optional(),
        assigneeId: z.string(),
        status: z.nativeEnum(TaskStatus),
        lastTime: z.string(),
        currentUserId: z.string(),
      })
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
      } = c.req.valid("json");
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
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  )
  // 获取任务
  .get(
    "/get",
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        currentUserId: z.string(),
        projectId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        lastTime: z.string().nullish(),
        assigneeId: z.string().nullish(),
      })
    ),
    async (c) => {
      const {
        workspaceId,
        projectId,
        currentUserId,
        status,
        search,
        lastTime,
        assigneeId,
      } = c.req.valid("query");
      const [error, data] = await to(
        getJebtTask({
          currentUserId,
          workspaceId,
          projectId,
          status,
          search,
          lastTime,
          assigneeId,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  );

export default task;
