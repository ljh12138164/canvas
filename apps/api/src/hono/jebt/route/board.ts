import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createJebtWorkspace,
  deleteJebtWorkspace,
  getJebtWorkspace,
  getJebtWorkspaceByInviteCode,
  joinJebtWorkspace,
  refreshJebtWorkspace,
  updateJebtWorkspace,
} from "../../../server/jebt/board";
import { z } from "zod";
import to from "await-to-js";
import { errorCheck } from "../../../libs/error";
const board = new Hono()
  // 创建工作区
  .post(
    "/create",
    zValidator(
      "form",
      z.object({
        name: z.string(),
        file: z.any(),
        userId: z.string(),
        email: z.string(),
        userImage: z.string(),
        username: z.string(),
      })
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { userId, name, file, email, userImage, username } = body;
      const [error, workspace] = await to(
        createJebtWorkspace({
          name: name as string,
          userId: userId as string,
          file,
          email: email as string,
          userImage: userImage as string,
          username: username as string,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  )
  // 更新工作区
  .patch(
    "/update",
    zValidator(
      "form",
      z.object({
        id: z.string(),
        name: z.string(),
        file: z.any(),
        userId: z.string(),
        oldImageUrl: z.string(),
      })
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { id, name, file, userId, oldImageUrl } = body;
      const [error, workspace] = await to(
        updateJebtWorkspace({
          id: id as string,
          name: name as string,
          userId: userId as string,
          file,
          oldImageUrl: oldImageUrl as string,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  )
  // 获取工作区
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({ id: z.string().min(1, { message: "userID不能为空" }) })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const [error, workspace] = await to(getJebtWorkspace(id));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  )
  // 删除工作区
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().min(1, { message: "userID不能为空" }),
      })
    ),
    zValidator(
      "json",
      z.object({
        userId: z.string().min(1, { message: "userID不能为空" }),
        imageUrl: z.string().min(1, { message: "imageUrl不能为空" }),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { userId, imageUrl } = c.req.valid("json");

      const [error, workspace] = await to(
        deleteJebtWorkspace(id, userId, imageUrl)
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  )
  // 刷新工作区
  .post(
    "/refresh",
    zValidator(
      "json",
      z.object({
        id: z.string().min(1, { message: "id不能为空" }),
        userId: z.string().min(1, { message: "userID不能为空" }),
      })
    ),
    async (c) => {
      const { id, userId } = c.req.valid("json");
      const [error, workspace] = await to(refreshJebtWorkspace(id, userId));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  )
  // 通过邀请码获取工作区
  .get(
    "/dashboard/:inviteCode",
    zValidator(
      "param",
      z.object({ inviteCode: z.string().min(6, { message: "邀请码不能为空" }) })
    ),
    async (c) => {
      const { inviteCode } = c.req.valid("param");
      const [error, workspace] = await to(
        getJebtWorkspaceByInviteCode(inviteCode)
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  )
  // 加入工作区
  .post(
    "/join",
    zValidator(
      "json",
      z.object({
        userId: z.string().min(1, { message: "userID不能为空" }),
        id: z.string().min(1, { message: "id不能为空" }),
        email: z.string().min(1, { message: "email不能为空" }),
        userImage: z.string().min(1, { message: "userImage不能为空" }),
        username: z.string().min(1, { message: "username不能为空" }),
      })
    ),
    async (c) => {
      const { userId, id, email, userImage, username } = c.req.valid("json");
      const [error, workspace] = await to(
        joinJebtWorkspace(userId, id, email, userImage, username)
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  );
export default board;
