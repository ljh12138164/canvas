import { SupabaseAdapter } from "@auth/supabase-adapter";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { supabase } from "./database/supbash";
declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.NEXT_PUBLIC_AUTH_GITHUB_ID!,
      clientSecret: process.env.NEXT_PUBLIC_AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID!,
      clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET!,
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   //自定义凭证登录
    //   async authorize(credentials) {
    //     const { email, password } = credentials;
    //     const { data, error } = await supabase.auth.signInWithPassword({
    //       email: email as string,
    //       password: password as string,
    //     });
    //     if (error || !data.user) {
    //       //为注册
    //       return null;
    //     }
    //     return data.user;
    //   },
    // }),
  ],
  // adapter: SupabaseAdapter({
  //   url: "https://osdawghfaoyysblfsexp.supabase.co",
  //   secret: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  // }),
  // session: {
  //   strategy: "jwt",
  // },
  // callbacks: {
  //   async session({ session, user, token }) {
  //     const signingSecret = process.env.SUPABASE_JWT_SECRET!;
  //     const payload = {
  //       aud: "authenticated",
  //       exp: Math.floor(new Date(session.expires).getTime() / 1000),
  //       sub: user.id,
  //       email: user.email,
  //       role: "authenticated",
  //     };
  //     if (token.id) {
  //       session.user.id = token.id;
  //     }
  //     const supabaseAccessToken = jwt.sign(payload, signingSecret);
  //     return {
  //       ...session,
  //       supabaseAccessToken,
  //     };
  //   },
  //   // 将用户信息添加到 token 中
  //   jwt: async ({ token, user }) => {
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  // },，
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
});
