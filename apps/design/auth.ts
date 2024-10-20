import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import jwt from "jsonwebtoken";
import GithubProvider from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: "https://osdawghfaoyysblfsexp.supabase.co",
    secret: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };
        const supabaseAccessToken = jwt.sign(payload, signingSecret);
        return {
          ...session,
          supabaseAccessToken,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
// callbacks: {
//   async session({ session, user }) {
//     const signingSecret = process.env.SUPABASE_JWT_SECRET;
//     if (signingSecret) {
//       const payload = {
//         aud: "authenticated",
//         exp: Math.floor(new Date(session.expires).getTime() / 1000),
//         sub: user.id,
//         email: user.email,
//         role: "authenticated",
//       };
//       const supabaseAccessToken = jwt.sign(payload, signingSecret);
//       return {
//         ...session,
//         supabaseAccessToken,
//       };
//     }
//     return session;
//   },
// },
