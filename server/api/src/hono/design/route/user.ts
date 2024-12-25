// import { error401 } from "../../../libs/error";
// import { checkoutCookie, jwtEncode } from "../../../libs/sign-in";
// import { createUser, getCurrentUser, signIn } from "../../../server/design";
// import { zValidator } from "@hono/zod-validator";
// import { Hono } from "hono";
// import md5 from "blueimp-md5";
// import { deleteCookie } from "hono/cookie";
// import { z } from "zod";
// // TODO: 双 token
// const user = new Hono()
//   .post(
//     "/sign-up",
//     zValidator(
//       "json",
//       z.object({
//         name: z.string().min(2).max(10),
//         accoute: z.string().min(5).max(10),
//         password: z.string(),
//       })
//     ),
//     async (c) => {
//       try {
//         const { name, accoute, password } = c.req.valid("json");
//         const hashPassword = md5(password);
//         const user = await createUser({
//           name,
//           account: accoute,
//           password: hashPassword,
//         });
//         if (!user) throw new Error("注册失败");
//         const token = await jwtEncode({
//           userid: user.id,
//           expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         });
//         return c.json({ user, token }, 200);
//       } catch {
//         return c.json({ message: "账号已存在" }, 400);
//       }
//     }
//   )
//   //退出
//   .post("/sign-out", async (c) => {
//     deleteCookie(c, "token");
//     return c.json({ message: "退出成功" }, 200);
//   })
//   //登录
//   .post(
//     "/sign-in",
//     zValidator(
//       "json",
//       z.object({
//         account: z.string().min(5),
//         password: z
//           .string()
//           .min(6, "密码长度至少为6位")
//           .max(16, "密码长度最多为16位"),
//       })
//     ),
//     async (c) => {
//       const { account, password } = c.req.valid("json");
//       try {
//         const user = await signIn({ account, password });
//         if (!user) return c.json({ message: "账号或密码错误" }, 400);
//         const token = await jwtEncode({
//           userid: user.id,
//           expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         });

//         return c.json({ user, token }, 200);
//       } catch (error) {
//         return c.json({ message: error }, 400);
//       }
//     }
//   )
//   .get("/message", async (c) => {
//     console.log(c.req.header("Authorization"));
//     try {
//       let user;
//       try {
//         user = await checkoutCookie(c);
//       } catch (error) {
//         return error401(c);
//       }
//       const userData = await getCurrentUser({ userId: user.userid });
//       return c.json(userData, 200);
//     } catch (error) {
//       return error401(c);
//     }
//   });
// export default user;
