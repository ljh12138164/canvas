import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./database/supbash";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }) as any,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      //自定义凭证登录
      async authorize(credentials) {
        const { email, password } = credentials;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email as string,
          password: password as string,
        });
        if (error || !data.user) {
          //未注册
          return null;
        }
        return data.user;
      },
    }),
  ],

  // 将用户信息添加到 token 中
  // },
  adapter: SupabaseAdapter({
    url: "https://osdawghfaoyysblfsexp.supabase.co",
    secret: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
});
