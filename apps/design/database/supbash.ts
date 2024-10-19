// import { auth } from "@/auth";
// import { createClient } from "@supabase/supabase-js";
// import { Session } from "next-auth";
// type SessionSupabase = Session & { supabaseAccessToken: string };
// async function supabaseClient() {
//   // const session = await auth();
//   // if (!session) {
//   //   throw new Error("未登录");
//   // }
//   // const { supabaseAccessToken } = session as SessionSupabase;
//   // const supabase = createClient(
//   //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   //   {
//   //     global: {
//   //       headers: {
//   //         Authorization: `Bearer ${supabaseAccessToken}`,
//   //       },
//   //     },
//   //   }
//   // );
//   // return supabase;
// }

// export { supabaseClient };
