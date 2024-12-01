import { Context, MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

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
type UserData = typeof a;
declare module "hono" {
  interface Context {
    userData: {
      payload: UserData;
      jwt: string;
    } | null;
  }
}
declare module "hono" {
  interface ContextVariableMap {
    supabaseAuth: { auth: JWTPayload; token: string };
  }
}

export const getSupabaseAuth = (c: Context) => {
  return c.get("supabaseAuth") as { auth: JWTPayload; token: string };
};

export const checkToken = (supabase: string): MiddlewareHandler => {
  return async (c, next) => {
    const secret = supabase;
    const token = c.req.header("Authorization");

    if (!token) return c.json({ message: "token is required" }, 401);
    const jwt = token.split(" ").at(-1);
    if (!jwt) return c.json({ message: "token is invalid" }, 401);

    try {
      const payload = await verify(jwt, secret);
      c.set("supabaseAuth", { auth: payload, token: jwt });
      await next();
    } catch (e) {
      return c.json({ message: "jwt is invalid" }, 401);
    }
  };
};
