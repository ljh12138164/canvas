// import { getCurrentUser } from "../../server/design";
// import { Context } from "hono";
// import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { verify } from 'hono/jwt';
// /**
//  * 生成jwt
//  * @param payload
//  * @returns
//  */
// export function jwtEncode(payload: Payload) {
//   const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setExpirationTime("30d")
//     .sign(JWT_SECRET);
// }
// interface DecodeResult extends JWTPayload {
//   userid: string;
//   expiresAt: Date;
// }
/**
 * 解码jwt
 * @param token
 * @returns
 */
export async function jwtDecode(token: string) {
  const JWT_SECRET = process.env.JWT_SECRET!;
  try {
    const { payload } = await verify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// /**
//  * 获取用户信息
//  * @param userId
//  * @returns
//  */
// export async function getUser(userId: string) {
//   const user = await getCurrentUser({ userId });
//   return user;
// }

// /**
//  * ## 检查token
//  * @param c
//  * @returns
//  */
// export async function checkoutCookie(c: Context): Promise<Payload> {
//   return new Promise(async (resolve, reject) => {
//     const token = c.req.header("Authorization")?.split(" ")[1];
//     if (!token) reject(new Error("请先登录"));
//     const user = await jwtDecode(token);
//     if (!user) reject(new Error("请先登录"));
//     if (user) {
//       resolve(user);
//     }
//   });
// }
