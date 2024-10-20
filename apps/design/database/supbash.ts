import { Session } from "next-auth";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://osdawghfaoyysblfsexp.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export type SessionSupabase = Session & { supabaseAccessToken: string };
export const supabaseClient = async (session: SessionSupabase) => {
  const supabase = createClient(supabaseUrl, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${session.supabaseAccessToken}`,
      },
    },
  });
  return supabase;
};
