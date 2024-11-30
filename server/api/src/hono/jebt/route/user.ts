import { zValidator } from "@hono/zod-validator";
import to from "await-to-js";
import { Hono } from "hono";
import { z } from "zod";
import { errorCheck } from "../../../libs/error";
import {
  deleteJebtUser,
  getJebtUserList,
  updateJebtUserRole,
} from "../../../server/jebt/user";
// import { getJebtUserList } from "../../../server/jebt/user";
const user = new Hono()
  // 获取工作区成员列表
  .get(
    "/list",
    zValidator(
      "query",
      z.object({ workspaceId: z.string(), userId: z.string() })
    ),
    async (c) => {
      const { workspaceId, userId } = c.req.valid("query");
      const [error, data] = await to(getJebtUserList(workspaceId, userId));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  )
  // 修改用户角色
  .post(
    "/update",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
        role: z.enum(["admin", "member"]),
        workspaceId: z.string(),
        currentUserId: z.string(),
      })
    ),
    async (c) => {
      const { userId, role, workspaceId, currentUserId } = c.req.valid("json");
      const [error, data] = await to(
        updateJebtUserRole({ workspaceId, userId, role, currentUserId })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  )
  // 删除用户
  .delete(
    "/delete",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
        workspaceId: z.string(),
        currentUserId: z.string(),
      })
    ),
    async (c) => {
      const { userId, workspaceId, currentUserId } = c.req.valid("json");
      const [error, data] = await to(
        deleteJebtUser({ userId, workspaceId, currentUserId })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  );

export default user;
