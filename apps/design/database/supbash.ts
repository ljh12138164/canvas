import { Session } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { checkSession } from "@/lib/api/image";
const supabaseUrl = "https://osdawghfaoyysblfsexp.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
type SessionSupabase = Session & { supabaseAccessToken: string };
export const supabaseClient = async () => {
  const session = (await checkSession()) as SessionSupabase | null;
  if (!session) {
    throw new Error("未登录");
  }
  const supabase = createClient(supabaseUrl, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${session.supabaseAccessToken}`,
      },
    },
  });
  return supabase;
};
