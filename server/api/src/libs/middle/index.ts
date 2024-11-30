import { Session, AuthSession } from "@supabase/supabase-js";
import { Context, Next } from "hono";
import { JWTPayload, jwtVerify } from "jose";
import { verify } from "hono/jwt";

const a = {
  iss: "https://dtdgcdckrehydymmxhng.supabase.co/auth/v1",
  sub: "0cbd3058-5c2a-4705-98cf-2a43403c74ea",
  aud: "authenticated",
  exp: 1733016917,
  iat: 1732980917,
  email: "3479261099@qq.com",
  phone: "",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {
    email: "3479261099@qq.com",
    email_verified: false,
    fullName: "123",
    image:
      "https://dtdgcdckrehydymmxhng.supabase.co/storage/v1/object/public/USER_IMAGE/avatar.svg",
    phone_verified: false,
    sub: "0cbd3058-5c2a-4705-98cf-2a43403c74ea",
  },
  role: "authenticated",
  aal: "aal1",
  amr: [{ method: "password", timestamp: 1732980917 }],
  session_id: "00eb12f0-1e0b-4f6a-8f3e-6c171018cd2f",
  is_anonymous: false,
};
interface User extends JWTPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
  };
  role: string;
  aal: string;
  amr: { method: string; timestamp: number }[];
  session_id: string;
  is_anonymous: boolean;
}
declare module "hono" {
  interface Context {
    userData: {
      payload: JWTPayload & AuthSession;
      jwt: string;
    } | null;
  }
}
export const getSupabaseAuth = (c: Context) => {
  return c.get("supabaseAuth");
};

export const checkToken = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization");
  if (!token) {
    return c.json({ message: "token is required" }, 401);
  }
  const jwt = token.split(" ").at(-1);
  if (!jwt) {
    return c.json({ message: "token is invalid" }, 401);
  }
  const secret = process.env.NOTE_JWT_SECRET;
  if (!secret) {
    return c.json({ message: "JWT secret is not configured" }, 500);
  }
  const payload = await verify(jwt, secret);
  console.log({ payload });
  c.set("userData", { payload, jwt });
  await next();
};
